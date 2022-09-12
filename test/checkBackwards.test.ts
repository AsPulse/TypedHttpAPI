import { checkBackwards } from '../src/generator/parseInterface';

it('checkBackwards', () => {
  expect(checkBackwards('abcde', 3, 'cd')).toBe(true);
  expect(checkBackwards('abcde', 1, 'ab')).toBe(true);
  expect(checkBackwards('abcde', 0, 'ca')).toBe(false);
});
