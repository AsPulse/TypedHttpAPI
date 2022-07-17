import { parseEndPoint } from '../util/parseEndPoint';
import type { APIImplements, APIImplement } from './api';
import type { APIEndPoint, APISchema } from './schema';

export class TypedHttpAPIImplements<APISchemaType extends APISchema, Raw = undefined> {
  private implementations: APIImplements<APISchemaType, Raw>[] = [];
  constructor(public schema: APISchemaType){}

  implement<
    EndPoint extends (keyof APISchemaType & APIEndPoint),
  >(endpoint: EndPoint, processor: APIImplement<APISchemaType, Raw, EndPoint>['processor']) {
    this.implementations.push({
      endpoint: parseEndPoint(endpoint),
      processor,
      io: this.schema[endpoint],
    });
    return this;
  }

  static unpack<T extends APISchema, Raw>(t: TypedHttpAPIImplements<T, Raw>) {
    return t.implementations;
  }
}
