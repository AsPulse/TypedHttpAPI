import type { InternalRecord } from 'runtypes';
import { Record } from 'runtypes';
import type { RuntypeBase } from 'runtypes/lib/runtype';
import type { BetterObjectConstructor } from '../util/betterObjectConstrutor';
import type { HttpRequestMethod } from './httpMethod';

type FieldRuntypeBase = { [_: string]: RuntypeBase };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAPISchemaIO = APISchemaIO<any, any>;

type UnWrappedAPISchemaIO = {
  request: FieldRuntypeBase,
  response: FieldRuntypeBase,
}

type APISchemaIO<T extends FieldRuntypeBase, U extends FieldRuntypeBase> = {
  request: InternalRecord<T, false, false>,
  response: InternalRecord<U, false, false>
};

type APISchemaIOWrapper<T extends UnWrappedAPISchemaIO> = { [P in keyof UnWrappedAPISchemaIO]: InternalRecord<T[P], false, false> };
type APISchemaWrapper<T extends APISchemaTemplate<UnWrappedAPISchemaIO>> = { [P in keyof T & APIEndPoint]: APISchemaIOWrapper<T[P]> };

export type APIEndPoint =`${HttpRequestMethod} /${string}`;

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = APISchemaTemplate<AnyAPISchemaIO>;

type APISchemaTemplate<Schema extends AnyAPISchemaIO | UnWrappedAPISchemaIO> = {
  [key: APIEndPoint]: Schema,
};

declare const Object: BetterObjectConstructor;

export const generateAPISchema = <T extends ReadonlyArray<APISchemaTemplate<UnWrappedAPISchemaIO>>>(...input: T): APISchemaWrapper<T[0]> => 
  Object.fromEntries(Object.entries(input[0]).map(v => [v[0], { request: Record(v[1].request), response: Record(v[1].response) }]));
