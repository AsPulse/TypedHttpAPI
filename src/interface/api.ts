import type { Static } from 'runtypes';
import type { HttpAPIRequest, HttpAPIResponse, HttpRequest, HttpResponse } from './httpInterface';
import type { HttpRequestMethod } from './httpMethod';
import type { APISchema, APIEndPoint, AnyAPISchemaIO } from './schema';

export type APIImplement<
  APISchemaType extends APISchema,
  Raw,
  EndPoint extends (keyof APISchemaType & APIEndPoint) = keyof APISchemaType & APIEndPoint,
> = {
  endpoint: EndPoint,
  processor: (request: HttpAPIRequest<Raw, Static<APISchemaType[EndPoint]['response']>>, body: Static<APISchemaType[EndPoint]['request']>) => Promise<HttpAPIResponse<Static<APISchemaType[EndPoint]['response']>>>,
};

export type StructuredEndPoint = {
  uri: string,
  method: HttpRequestMethod,
}

export type APIImplements<
  APISchemaType extends APISchema,
  Raw,
> = {
  io: AnyAPISchemaIO,
  endpoint: StructuredEndPoint,
  processor: APIImplement<APISchemaType, Raw, keyof APISchemaType & APIEndPoint>['processor'],
};

export type APIExport<Raw> = {
  endpoint: StructuredEndPoint,
  processor: (option: APIImplementOption) => (request: HttpRequest<Raw>) => Promise<HttpResponse>
}

export type APIImplementOption = {
  incorrectTypeMessage: HttpResponse,
};
