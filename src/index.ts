import { TypedAPIExports } from './export';
import type { APIImplements, APIImplement, APIExport } from './interface/api';
import { HttpAPIRequest, HttpAPIResponse } from './interface/httpInterface';
import { HTTP_REQUEST_METHODS } from './interface/httpMethod';
import type { APISchema, APIEndPoint } from './interface/schema';
import { detectDuplicate } from './util/detectDuplicate';
import { generateSummary } from './util/formatSummary';
import { parseEndPoint } from './util/parseEndPoint';

export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = undefined> {
  private implementations: APIImplements<APISchemaType, Raw>[] = [];
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

  export(summary = true): TypedAPIExports<Raw> {
    const types: APIExport<Raw>[] = this.implementations.map(v => ({
      uri: v.uri,
      method: v.method,
      async processor(request) {
        const payload = request.body;
        if(!v.io.request.is(payload)) return { code: 400, data: '400 Bad Request The payload type is incorrect.' };
        return HttpAPIResponse.unpack(await v.processor(new HttpAPIRequest(request), payload));
      },
    }));
    if(summary) generateSummary({
      apiCount: HTTP_REQUEST_METHODS.map(v => ({ method: v, count: types.filter(e => e.method === v).length })),
      doublingEndpoints: detectDuplicate(types.map(v => `${v.method} ${v.uri}`)),
      shortageEndpoints: Object.entries(this.schema).map(v => v[0]).filter(v => types.find(e => `${e.method} ${e.uri}` === v) === undefined),
    }).forEach(v => console.log(v));
    return new TypedAPIExports(types);
  }
}
