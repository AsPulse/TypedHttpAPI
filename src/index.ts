import type { HttpAPIRequest } from './interface/httpInterface';
import type { HttpRequestMethod } from './interface/httpMethod';
import type { APISchema, APIEndPoint} from './interface/schema';
import { parseEndPoint } from './util/parseEndPoint';

type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (input: APISchemaType[EndPoint]['request'], req: HttpAPIRequest<Raw>) => Promise<APISchemaType[EndPoint]['response']>,
};
type APIImplements<
  APISchemaType extends APISchema,
  Raw,
> = {
  uri: string,
  method: HttpRequestMethod,
  processor: APIImplement<APISchemaType, Raw, keyof APISchemaType & APIEndPoint>['processor']
};

export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = null> {
  implementations: APIImplements<APISchemaType, Raw>[] = [];

  implement<
    EndPoint extends (keyof APISchemaType & APIEndPoint),
  >(endpoint: EndPoint, processor: APIImplement<APISchemaType, Raw, EndPoint>['processor']) {
    this.implementations.push({
      ...parseEndPoint(endpoint),
      processor,
    });
    return this;
  }
}
