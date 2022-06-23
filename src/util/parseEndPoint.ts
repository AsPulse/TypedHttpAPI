import type { HttpRequestMethod} from './../interface/httpMethod';
import { HTTP_REQUEST_METHODS } from './../interface/httpMethod';
import type { APIEndPoint } from '../interface/schema';

export function parseEndPoint(endpoint: APIEndPoint): {
  method: HttpRequestMethod,
  uri: string,
} {
  const [method, ...uri] = endpoint.split(' ');
  return {
    method: HTTP_REQUEST_METHODS.find(v => v === method) ?? 'GET',
    uri: uri.join(' '),
  };
}
