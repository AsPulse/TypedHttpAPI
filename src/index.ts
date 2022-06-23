import type { Type, TypeOf } from 'io-ts';
import { type } from 'io-ts';
import type { HttpAPIRequest } from './interface/httpInterface';
import type { HttpRequestMethod } from './interface/httpMethod';
import { generateAPISchema } from './interface/schema';
import type { APISchema, APISchemaIO, RemoveNoIOMethod } from './interface/schema';


type KeysOfUnion<T> = T extends T ? keyof T : never;
type KeysOfRefer<T, Filter> = T extends T ? T[keyof T & Filter] : never;
type OptionalRefer<Target, T extends Target | undefined, In extends keyof Target > = T extends Target ? T[In] : never;
type OptionalTypeOf<T extends Type<unknown> | never> = T extends never ? never : TypeOf<T>;

type IoToIots<IO extends APISchemaIO | undefined, Field extends keyof APISchemaIO>
  = OptionalTypeOf<OptionalRefer<APISchemaIO, IO, Field>>;

type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends keyof APISchemaType = keyof APISchemaType,
  Method extends KeysOfUnion<RemoveNoIOMethod<APISchemaType[EndPoint]>> = KeysOfUnion<RemoveNoIOMethod<APISchemaType[EndPoint]>>,
  IO extends KeysOfRefer<APISchemaType[EndPoint], Method> = KeysOfRefer<APISchemaType[EndPoint], Method>
> = {
  endpoint: EndPoint,
  method: Method,
  processor: (req: HttpAPIRequest<IoToIots<IO, 'request'>, Raw>) => Promise<IoToIots<IO, 'response'>>,
};
//KeysOfUnion<RemoveNoIOMethod<APISchemaType[EndPoint]>>;




export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = null> {
  implementations: APIImplement<APISchemaType, Raw>[] = [];

  implement<
    Implemenet extends APIImplement<APISchemaType, Raw>,
  >(endpoint: Implemenet['endpoint'], method: Implemenet['method'], processor: Implemenet['processor']) {
    this.implementations.push({
      endpoint,
      method,
      processor,
    });
    return this;
  }
}

const schema: APISchema = generateAPISchema({
  'a': {
    'POST': {
      request: type({}),
      response: type({}),
    },
  },
},null);

new TypedHttpAPIServer<>();
