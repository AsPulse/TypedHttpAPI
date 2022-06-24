import type { HttpRequest, HttpResponse } from './interface/httpInterface';
import { HttpAPIRequest, HttpAPIResponse } from './interface/httpInterface';
import type { HttpRequestMethod } from './interface/httpMethod';
import type { APISchema, APIEndPoint, APISchemaIO } from './interface/schema';
import { parseEndPoint } from './util/parseEndPoint';

type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (input: APISchemaType[EndPoint]['request'], req: HttpAPIRequest<Raw>) => Promise<HttpAPIResponse<APISchemaType[EndPoint]['response']>>,
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

type APIExport<Raw> = {
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

  export(): APIExport<Raw>[] {
    return this.implementations.map(v => ({
      uri: v.uri,
      method: v.method,
      async processor(request) {
        const payload = request.body;
        if(!v.io.request.is(payload)) return { code: 400, data: '400 Bad Request The payload type is incorrect.' };
        return HttpAPIResponse.unpack(await v.processor(payload, new HttpAPIRequest(request)));
      },
    }));
  }
}
