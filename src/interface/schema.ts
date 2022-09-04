import type { RuntypeBase } from 'runtypes/lib/runtype';
import { Types } from './generatedRuntypes';
import type { HttpRequestMethod } from './httpMethod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAPISchemaIO = FieldReference<APISchemaIO<any, any>>;

interface FieldReference<T> {
  fields: T,
}

interface FieldReference<T> {
  fields: T,
}

type FieldOut<T> = T extends { fields: unknown } ?  T['fields'] : never;


type APISchemaIO<T, U> = {
  request: RuntypeBase<T>,
  response: RuntypeBase<U>
};

export type APIEndPoint =`${HttpRequestMethod} /${string}`;

/**
 * For each API endpoint, specify the request method, request interface and response interfaces.
 */
export type APISchema = APISchemaTemplate<AnyAPISchemaIO>;

type APISchemaTemplate<Schema> = {
  [key: APIEndPoint]: Schema
};


type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;


export const generateAPISchema = <U extends FieldReference<APISchema>, T extends readonly FieldReference<APISchema>[] = []>(input: U |  {
  intersectees: [U, ...T]
}): UnionToIntersection<{
  [P in keyof [U, ...T] & number]: FieldOut<[U, ...T][P]>
}[number]> => bundleAPISchema(arraylizeAPISchema(input));

//HACK
const arraylizeAPISchema = <U extends FieldReference<APISchema>, T extends readonly FieldReference<APISchema>[] = []>(input: U |  {
  intersectees: [U, ...T]
}): [U, ...T] => ('intersectees' in input ? input.intersectees : [input]) as [U, ...T];

//HACK
const bundleAPISchema = <T extends readonly APISchema[]>(input: 
  {
    [P in keyof T]: FieldReference<T[P]>
  },
): UnionToIntersection<T[number]> => 
  input.map(v => v.fields).reduce((a, b) => ({ ...a, ...b }), {}) as UnionToIntersection<T[number]>;


export const apiSchema = generateAPISchema(Types);

