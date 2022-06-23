import type { Type } from 'io-ts';
import type { HttpRequestMethod } from './httpMethod';


export type APISchemaIO = {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: Type<any>,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: Type<any>

};

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = {
  [EndPoint in string]: {
    [Method in HttpRequestMethod]?: APISchemaIO
  }
};

export type RemoveNoIOMethod<T extends APISchema[keyof APISchema]> 
  = { [P in keyof T as T[P] extends APISchemaIO ? P : never]: T[P] }


export const generateAPISchema = <T extends ReadonlyArray<APISchema>>(...input: T): T[0] => input[0];
