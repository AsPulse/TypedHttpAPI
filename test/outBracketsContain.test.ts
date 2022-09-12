import { countOutBracketContains, outBracketContains, splitOutBracket } from '../src/generator/parseType';

it('outBracketsContain', () => {
  expect(outBracketContains('aa(c|d)e', '|')).toBe(false);
  expect(outBracketContains('a|a(c|d)e', '|')).toBe(true);
  expect(outBracketContains('a|a(c%d)e', '|')).toBe(true);
});

it('countOutBracketsContain', () => {
  expect(countOutBracketContains('aa(c|d)e', '|')).toBe(0);
  expect(countOutBracketContains('a|a(c|d)e', '|')).toBe(1);
  expect(countOutBracketContains('a|a(c%d)|e', '|')).toBe(2);
});

it('splitOutBracket', () => {
  expect(splitOutBracket('aa(c|d)e', '|')).toStrictEqual(['aa(c|d)e']);
  expect(splitOutBracket('a|a(c|d)e', '|')).toStrictEqual(['a','a(c|d)e']);
  expect(splitOutBracket('a|a(c%d)|e', '|')).toStrictEqual(['a','a(c%d)','e']);
});
