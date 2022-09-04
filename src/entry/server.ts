import { TypedAPIExports } from '../export';
import type { APIImplements, APIImplement, APIExport } from '../interface/api';
import { HttpAPIRequest, HttpAPIResponse } from '../interface/httpInterface';
import { HTTP_REQUEST_METHODS } from '../interface/httpMethod';
import type { APISchema, APIEndPoint } from '../interface/schema';
import type { BetterObjectConstructor } from 'better-object-constructor';
import { detectDuplicate } from '../util/detectDuplicate';
import { generateSummary } from '../util/formatSummary';
import { parseEndPoint } from '../util/parseEndPoint';
import { TypedHttpAPIImplements } from '../interface/implements';

declare const Object: BetterObjectConstructor;

export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = undefined> {
  private implementations: APIImplements<APISchemaType, Raw>[] = [];
  constructor(public schema: APISchemaType){}

  implement<
    EndPoint extends (keyof APISchemaType & APIEndPoint),
  >(endpoint: EndPoint, processor: APIImplement<APISchemaType, Raw, EndPoint>['processor']): TypedHttpAPIServer<APISchemaType, Raw>

  implement(t: TypedHttpAPIImplements<APISchemaType>): TypedHttpAPIServer<APISchemaType, Raw>

  implement<
    EndPoint extends (keyof APISchemaType & APIEndPoint),
  >(a: EndPoint | TypedHttpAPIImplements<APISchemaType, Raw>, b?: APIImplement<APISchemaType, Raw, EndPoint>['processor']) {
    if(a instanceof TypedHttpAPIImplements) {
      this.implementations = 
      [...this.implementations, ...TypedHttpAPIImplements.unpack(a)];
    } else if (b !== undefined) {
      this.implementations.push({
        endpoint: parseEndPoint(a),
        processor: b,
        io: this.schema['fields'][a],
      });
    }
    return this;
  }


  export(summary = true): TypedAPIExports<Raw> {
    const types: APIExport<Raw>[] = this.implementations.map(v => ({
      endpoint: v.endpoint,
      processor: option => async request => {
        const payload = request.body;
        if(!v.io.fields.request.guard(payload)) return option.incorrectTypeMessage;
        return HttpAPIResponse.unpack(await v.processor(new HttpAPIRequest(request), payload));
      },
    }));
    const shortage = Object.entries(this.schema.fields).map(v => v[0]).filter(v => types.find(e => `${e.endpoint.method} ${e.endpoint.uri}` === v) === undefined);
    if(summary) generateSummary({
      apiCount: HTTP_REQUEST_METHODS.map(v => ({ method: v, count: types.filter(e => e.endpoint.method === v).length })),
      doublingEndpoints: detectDuplicate(types.map(v => `${v.endpoint.method} ${v.endpoint.uri}`)),
      shortageEndpoints: shortage,
    }).forEach(v => console.log(v));
    return new TypedAPIExports(types, shortage.map(v => parseEndPoint(v)));
  }
}

export { TypedAPIExports, TypedAPIFastify } from '../export/index';
export { generateAPISchema } from '../interface/schema';
export { TypedHttpAPIImplements } from '../interface/implements';
