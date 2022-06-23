import type { Type } from 'io-ts';
import type { HttpRequestMethod } from './httpMethod';

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = {

  endpoint: string,

  method: HttpRequestMethod,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: Type<any>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: Type<any>
  
}[]
