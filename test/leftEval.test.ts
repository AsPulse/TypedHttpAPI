import { leftEval } from '../src/generator/parseType';

it('leftEval', () => {
  expect(leftEval('a & b | c')).toStrictEqual({ evalable: true, result: '(((a )& b )| c)' });
});
