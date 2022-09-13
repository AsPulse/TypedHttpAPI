
import { parseInterface } from '../src/generator/parseInterface';
import { parseType } from '../src/generator/parseType';

const original = `
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
`;

const parse = parseInterface(original);

test('parsePostRequest', async () => {
  expect(await parseType(parse.find(v => v.name === 'POSTRequest')?.value ?? '', async () => original)).toBe(
    'rt.Record({a:rt.Array(rt.String),d:rt.Number,hello:rt.Array(rt.Literal(\'world\'))})',
  );
});

test('parsePostResponse', async () => {
  expect(await parseType(parse.find(v => v.name === 'POSTResponse')?.value ?? '', async () => original)).toBe(
    'rt.Record({b:rt.String,style:rt.Union(rt.Literal(\'js\'),rt.Literal(\'ts\'))})',
  );
});

test('parseUnionOuter', async () => {
  expect(await parseType(parse.find(v => v.name === 'UnionOuter')?.value ?? '', async () => original)).toBe(
    'rt.Record({out:rt.Array(rt.Union(rt.String,rt.Number)),in:rt.Union(rt.Array(rt.String),rt.Array(rt.Number)),split:rt.Union(rt.String,rt.Array(rt.Number))})',
  );
});

test('parseCross', async () => {
  expect(await parseType(parse.find(v => v.name === 'Cross')?.value ?? '', async () => original)).toBe(
    'rt.Intersect(rt.Union(rt.String,rt.Number),rt.Boolean)',
  );
});

test('parseCross2', async () => {
  expect(await parseType(parse.find(v => v.name === 'Cross2')?.value ?? '', async () => original)).toBe(
    'rt.Union(rt.Intersect(rt.String,rt.Number),rt.Boolean)',
  );
});

test('parseCross3', async () => {
  expect(await parseType(parse.find(v => v.name === 'Cross3')?.value ?? '', async () => original)).toBe(
    'rt.Intersect(rt.Intersect(rt.String,rt.Union(rt.Number,rt.Boolean)),rt.Null)',
  );
});

test('parseMarto', async () => {
  expect(await parseType(parse.find(v => v.name === 'Marto')?.value ?? '', async () => original)).toBe(
    'rt.Record({a:rt.Record({b:rt.String})})',
  );
});

test('parseRefTest', async () => {
  expect(await parseType(parse.find(v => v.name === 'RefTest')?.value ?? '', async () => original)).toBe(
    'rt.Record({a:rt.Boolean})',
  );
});

test('parseRecordTest', async () => {
  expect(await parseType(parse.find(v => v.name === 'RecordTest')?.value ?? '', async () => original)).toBe(
    'rt.Record(rt.String,rt.Never)',
  );
});
