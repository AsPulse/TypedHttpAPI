import type { TypeOf } from 'io-ts';
import type { HttpAPIRequest, HttpAPIResponse, HttpRequest, HttpResponse } from './httpInterface';
import type { HttpRequestMethod } from './httpMethod';
import type { APISchema, APIEndPoint, APISchemaIO } from './schema';

export type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (request: HttpAPIRequest<Raw, TypeOf<APISchemaType[EndPoint]['response']>>, body: TypeOf<APISchemaType[EndPoint]['request']>) => Promise<HttpAPIResponse<TypeOf<APISchemaType[EndPoint]['response']>>>,
};

export type APIImplements<
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
  processor: (option: APIImplementOption) => (request: HttpRequest<Raw>) => Promise<HttpResponse>
}

export type APIImplementOption = {
  incorrectTypeMessage: HttpResponse,
};
