import type { Type } from 'io-ts';
import type { HttpRequestMethod } from './httpMethod';


export type APISchemaIO = {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: Type<any>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: Type<any>

};

export type APIEndPoint =`${HttpRequestMethod} /${string}`;

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = {
  [key: APIEndPoint]: APISchemaIO,
};

export const generateAPISchema = <T extends ReadonlyArray<APISchema>>(...input: T): T[0] => input[0];
