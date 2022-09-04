import type { HttpRequestMethod } from './httpMethod';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAPISchemaIO = FieldReference<APISchemaIO<any, any>>;

interface Guardable<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guard(x: any): x is T;
}

interface FieldReference<T> {
  fields: T,
}


type APISchemaIO<T, U> = {
  request: Guardable<T>,
  response: Guardable<U>
};



export type APIEndPoint =`${HttpRequestMethod} /${string}`;

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = FieldReference<APISchemaTemplate<AnyAPISchemaIO>>;

type APISchemaTemplate<Schema> = {
  [key: APIEndPoint]: Schema
};

export const generateAPISchema = <T extends APISchema>(input: T) => input;
