
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

`;

const parse = parseInterface(original);

test('parsePostRequest', () => {
  expect(parseType(parse.find(v => v.name === 'POSTRequest')?.value ?? '')).toBe(
    'rt.Record({a:rt.Array(rt.String),d:rt.Number,hello:rt.Array(rt.Literal(\'world\'))})',
  );
});

test('parsePostResponse', () => {
  expect(parseType(parse.find(v => v.name === 'POSTResponse')?.value ?? '')).toBe(
    'rt.Record({b:rt.String,style:rt.Union(rt.Literal(\'js\'),rt.Literal(\'ts\'))})',
  );
});

test('parseUnionOuter', () => {
  expect(parseType(parse.find(v => v.name === 'UnionOuter')?.value ?? '')).toBe(
    'rt.Record({out:rt.Array(rt.Union(rt.String,rt.Number)),in:rt.Union(rt.Array(rt.String),rt.Array(rt.Number)),split:rt.Union(rt.String,rt.Array(rt.Number))})',
  );
});

test('parseCross', () => {
  expect(parseType(parse.find(v => v.name === 'Cross')?.value ?? '')).toBe(
    'rt.Intersect(rt.Union(rt.String,rt.Number),rt.Boolean)',
  );
});

test('parseCross2', () => {
  expect(parseType(parse.find(v => v.name === 'Cross2')?.value ?? '')).toBe(
    'rt.Union(rt.Intersect(rt.String,rt.Number),rt.Boolean)',
  );
});

test('parseCross3', () => {
  expect(parseType(parse.find(v => v.name === 'Cross3')?.value ?? '')).toBe(
    'rt.Intersect(rt.Intersect(rt.String,rt.Union(rt.Number,rt.Boolean)),rt.Null)',
  );
});

test('parseMarto', () => {
  expect(parseType(parse.find(v => v.name === 'Marto')?.value ?? '')).toBe(
    'rt.Record({a:rt.Record({b:rt.String})})',
  );
});
