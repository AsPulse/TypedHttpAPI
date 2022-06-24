import type { TypeOf } from 'io-ts';
import { TypedAPIExports } from './export';
import type { HttpRequest, HttpResponse } from './interface/httpInterface';
import { HttpAPIRequest, HttpAPIResponse } from './interface/httpInterface';
import type { HttpRequestMethod} from './interface/httpMethod';
import { HTTP_REQUEST_METHODS } from './interface/httpMethod';
import type { APISchema, APIEndPoint, APISchemaIO } from './interface/schema';
import { detectDuplicate } from './util/detectDuplicate';
import { generateSummary } from './util/formatSummary';
import { parseEndPoint } from './util/parseEndPoint';

type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (input: TypeOf<APISchemaType[EndPoint]['request']>, req: HttpAPIRequest<Raw>, res: HttpAPIResponse<TypeOf<APISchemaType[EndPoint]['response']>>) => Promise<HttpAPIResponse<TypeOf<APISchemaType[EndPoint]['response']>>>,
};

type APIImplements<
  APISchemaType extends APISchema,
  Raw,
> = {
  io: APISchemaIO,
  uri: string,
  method: HttpRequestMethod,
  processor: APIImplement<APISchemaType, Raw, keyof APISchemaType & APIEndPoint>['processor']
};

export type APIExport<Raw> = {
  uri: string,
  method: HttpRequestMethod,
  processor: (request: HttpRequest<Raw>) => Promise<HttpResponse>
}


export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = undefined> {
  implementations: APIImplements<APISchemaType, Raw>[] = [];
  constructor(public schema: APISchemaType){}

  implement<
    EndPoint extends (keyof APISchemaType & APIEndPoint),
  >(endpoint: EndPoint, processor: APIImplement<APISchemaType, Raw, EndPoint>['processor']) {
    this.implementations.push({
      ...parseEndPoint(endpoint),
      processor,
      io: this.schema[endpoint],
    });
    return this;
  }

  export(): TypedAPIExports<Raw> {
    const types: APIExport<Raw>[] = this.implementations.map(v => ({
      uri: v.uri,
      method: v.method,
      async processor(request) {
        const payload = request.body;
        if(!v.io.request.is(payload)) return { code: 400, data: '400 Bad Request The payload type is incorrect.' };
        return HttpAPIResponse.unpack(await v.processor(payload, new HttpAPIRequest(request), new HttpAPIResponse()));
      },
    }));
    generateSummary({
      apiCount: HTTP_REQUEST_METHODS.map(v => ({ method: v, count: types.filter(e => e.method === v).length })),
      doublingEndpoints: detectDuplicate(types.map(v => `${v.method} ${v.uri}`)),
      shortageEndpoints: Object.entries(this.schema).map(v => v[0]).filter(v => types.find(e => `${e.method} ${e.uri}` === v) === undefined),
    }).forEach(v => console.log(v));
    return new TypedAPIExports(types);
  }
}
