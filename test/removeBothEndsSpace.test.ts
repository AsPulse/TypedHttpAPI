import { removeBothEndsSpace } from '../src/generator/parseInterface';


it('removeBothEndsSpace', () => {
  expect(removeBothEndsSpace('  a')).toBe('a');
  expect(removeBothEndsSpace('a')).toBe('a');
  expect(removeBothEndsSpace('a ')).toBe('a');
  expect(removeBothEndsSpace(' a ')).toBe('a');
  expect(removeBothEndsSpace(' a b ')).toBe('a b');
  expect(removeBothEndsSpace('  \na')).toBe('a');
  expect(removeBothEndsSpace('a\n')).toBe('a');
  expect(removeBothEndsSpace('a\n ')).toBe('a');
  expect(removeBothEndsSpace(' \na ')).toBe('a');
  expect(removeBothEndsSpace(' a\n \nb ')).toBe('a\n \nb');
});
