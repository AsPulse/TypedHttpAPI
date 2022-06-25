import type { InternalRecord } from 'runtypes';
import type { RuntypeBase } from 'runtypes/lib/runtype';
import type { HttpRequestMethod } from './httpMethod';

type FieldRuntypeBase = { [_: string]: RuntypeBase };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAPISchemaIO = APISchemaIO<any, any>;
export type APISchemaIO<T extends FieldRuntypeBase, U extends FieldRuntypeBase> = {
  request: InternalRecord<T, false, false>,
  response: InternalRecord<U, false, false>
};

export type APIEndPoint =`${HttpRequestMethod} /${string}`;

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = {
  [key: APIEndPoint]: AnyAPISchemaIO,
};

export const generateAPISchema = <T extends ReadonlyArray<APISchema>>(...input: T): T[0] => input[0];
