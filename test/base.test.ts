
import { parseInterface } from '../src/generator/parseInterface';
import { parseType } from '../src/generator/parseType';
import type { FileProvider } from '../src/generator/resolveSymbol';

const original = `
import type { ExternalInterfaceMarto } from './a'; 

export type POSTRequest = {
  a: string[]
  d: number;
  hello: ('world')[],
}

export interface POSTResponse {
  b: string;
  style: 'js' | 'ts'
};

export interface UnionOuter {
  out: (string | number)[]
  in: string[] | number[]
  split: string | number[]
}

export type Cross = string | number & boolean;
export type Cross2 = string & number | boolean;
export type Cross3 = string & (number | boolean) & null;

export interface Marto {
  a: {
    b: string;
  }
}

export interface RefTest {
  a: {
    b: { c: boolean };
  }['b']['c'];
}

export type RecordTest = Record<string, never>;

export type ResolveTest1 = Marto['a']['b'];

export type ResolveTest2 = ExternalInterfaceMarto['a']['b'];

`;

const external = `
export interface ExternalInterfaceMarto {
  a: {
    b: string;
  }
}
`;

export const p: FileProvider = async p => p === './a.ts' ? external : p === '' ? original : undefined;

const parse = parseInterface(original);
const i = (name: string) => parse.find(v => v.name === name)?.value ?? '';


test('parsePostRequest', async () => {
  expect(await parseType(i('POSTRequest'), p)).toBe(
    'rt.Record({a:rt.Array(rt.String),d:rt.Number,hello:rt.Array(rt.Literal(\'world\'))})',
  );
});

test('parsePostResponse', async () => {
  expect(await parseType(i('POSTResponse'), p)).toBe(
    'rt.Record({b:rt.String,style:rt.Union(rt.Literal(\'js\'),rt.Literal(\'ts\'))})',
  );
});

test('parseUnionOuter', async () => {
  expect(await parseType(i('UnionOuter'), p)).toBe(
    'rt.Record({out:rt.Array(rt.Union(rt.String,rt.Number)),in:rt.Union(rt.Array(rt.String),rt.Array(rt.Number)),split:rt.Union(rt.String,rt.Array(rt.Number))})',
  );
});

test('parseCross', async () => {
  expect(await parseType(i('Cross'), p)).toBe(
    'rt.Intersect(rt.Union(rt.String,rt.Number),rt.Boolean)',
  );
});

test('parseCross2', async () => {
  expect(await parseType(i('Cross2'), p)).toBe(
    'rt.Union(rt.Intersect(rt.String,rt.Number),rt.Boolean)',
  );
});

test('parseCross3', async () => {
  expect(await parseType(i('Cross3'), p)).toBe(
    'rt.Intersect(rt.Intersect(rt.String,rt.Union(rt.Number,rt.Boolean)),rt.Null)',
  );
});

test('parseMarto', async () => {
  expect(await parseType(i('Marto'), p)).toBe(
    'rt.Record({a:rt.Record({b:rt.String})})',
  );
});

test('parseRefTest', async () => {
  expect(await parseType(i('RefTest'), p)).toBe(
    'rt.Record({a:rt.Boolean})',
  );
});

test('parseRecordTest', async () => {
  expect(await parseType(i('RecordTest'), p)).toBe(
    'rt.Record(rt.String,rt.Never)',
  );
});

test('parseResolveTest1', async () => {
  expect(await parseType(i('ResolveTest1'), p)).toBe(
    'rt.String',
  );
});


test('parseResolveTest2', async () => {
  expect(await parseType(i('ResolveTest2'), p)).toBe(
    'rt.String',
  );
});
