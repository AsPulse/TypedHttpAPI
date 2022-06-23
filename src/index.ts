import type { HttpAPIRequest } from './interface/httpInterface';
import type { APISchema, APIEndPoint} from './interface/schema';

type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (input: APISchemaType[EndPoint]['request'], req: HttpAPIRequest<Raw>) => Promise<APISchemaType[EndPoint]['response']>,
};

export class TypedHttpAPIServer<APISchemaType extends APISchema, Raw = null> {
  implementations: APIImplement<APISchemaType, Raw>[] = [];

  implement<
    EndPoint extends (keyof APISchemaType & APIEndPoint),
  >(endpoint: EndPoint, processor: APIImplement<APISchemaType, Raw, EndPoint>['processor']) {
    this.implementations.push({
      endpoint,
      processor,
    });
    return this;
  }
}
