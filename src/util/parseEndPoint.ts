import { HTTP_REQUEST_METHODS } from './../interface/httpMethod';
import type { APIEndPoint } from '../interface/schema';
import type { StructuredEndPoint } from '../interface/api';

export function parseEndPoint(endpoint: APIEndPoint): StructuredEndPoint {
  const [method, ...uri] = endpoint.split(' ');
  return {
    method: HTTP_REQUEST_METHODS.find(v => v === method) ?? 'GET',
    uri: uri.join(' '),
  };
}
