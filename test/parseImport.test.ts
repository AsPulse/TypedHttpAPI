import { parseImport } from '../src/generator/resolveSymbol';

const imports = `
import { a, b } from './a';
import type { c } from './d';
`;

it('parseImport', () => {
  expect(parseImport(imports)).toStrictEqual([{ path: './a', types: ['a', 'b'] }, { path: './d', types: ['c'] }]);
});
