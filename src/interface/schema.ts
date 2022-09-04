import type { InternalRecord } from 'runtypes';
import type { RuntypeBase } from 'runtypes/lib/runtype';
import type { BetterObjectConstructor } from 'better-object-constructor';
import type { HttpRequestMethod } from './httpMethod';

type FieldRuntypeBase = { [_: string]: RuntypeBase };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAPISchemaIO = APISchemaIO<any, any>;

type APISchemaIO<T extends FieldRuntypeBase, U extends FieldRuntypeBase> = {
  request: InternalRecord<T, false, false>,
  response: InternalRecord<U, false, false>
};


export type APIEndPoint =`${HttpRequestMethod} /${string}`;

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = APISchemaTemplate<AnyAPISchemaIO>;

type APISchemaTemplate<Schema extends AnyAPISchemaIO> = {
  [key: APIEndPoint]: Schema,
};

declare const Object: BetterObjectConstructor;

export const generateAPISchema = <T extends ReadonlyArray<APISchemaTemplate<AnyAPISchemaIO>>>(...input: T): T[0] => 
  Object.fromEntries(Object.entries(input[0]).map(v => [v[0], { request: v[1].request, response: v[1].response }]));
