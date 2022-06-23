import type { TypeOf } from 'io-ts';
import { nullType, NullType, Type } from 'io-ts';
import { type } from 'io-ts';
import type { HttpAPIRequest } from './interface/httpInterface';
import type { HttpRequestMethod } from './interface/httpMethod';
import { generateAPISchema } from './interface/schema';
import type { APISchema, APISchemaIO , APIEndPoint} from './interface/schema';

type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (req: HttpAPIRequest<TypeOf<APISchemaType[EndPoint]['request']>, Raw>) => Promise<APISchemaType[EndPoint]['response']>,
};
//KeysOfUnion<RemoveNoIOMethod<APISchemaType[EndPoint]>>;
const schema = generateAPISchema({
  'GET a': {
    request: type({ x: nullType }),
    response: type({}),
  },
  'POST a': {
    request: type({ y: nullType }),
    response: type({}),
  },

  'DELETE v': {
    request: type({ w: nullType }),
    response: type({}),
  },
  'POST v': {
    request: type({ z: nullType }),
    response: type({}),
  },
});

type test = APIImplement<
  typeof schema,
  null
>;
/*

export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = null> {
  implementations: APIImplements<Raw>[] = [];

  implement<
    EndPoint extends keyof APISchemaType,
    Method extends KeysOfUnion<RemoveNoIOMethod<APISchemaType[EndPoint]>>,
  >(endpoint: EndPoint, method: Method, processor: APIImplement<APISchemaType, Raw, EndPoint, Method>['processor']) {
    this.implementations.push({
      endpoint,
      method,
      processor,
    });
    return this;
  }
}


new TypedHttpAPIServer<typeof schema, null>()
  .implement();
*/
