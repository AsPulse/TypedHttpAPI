import { removeBothEndsSpace } from './parseInterface';

export function parseType(type: string): string {
  if(type !== removeBothEndsSpace(type)) return parseType(removeBothEndsSpace(type));
  
  if(type.startsWith('{') && type.endsWith('}')) {
    const content = type.slice(1).slice(0, -1);
    const typed = splitOutBracket(content, /,|;|\n/)
      .map(v => removeBothEndsSpace(v))
      .filter(v => v !== '')
      .map(v => splitOutBracket(v, ':'))
      .map(v => v.map(e => removeBothEndsSpace(e)))
      .map(v => ({
        key: v[0],
        value: v[1],
      }))
      
      .map(v => ({
        key: v.key,
        value: parseType(v.value),
      }))
      .map(v => `${v.key}:${v.value}`);
    return `rt.Record({${typed}})`;
  }

  const evalResult = leftEval(type);
  if(evalResult.evalable) return parseType(evalResult.result);

  if(outBracketContains(type, '|')) return `rt.Union(${splitOutBracket(type, '|').map(v => parseType(v)).join(',')})`;
  if(outBracketContains(type, '&')) return `rt.Intersect(${splitOutBracket(type, '&').map(v => parseType(v)).join(',')})`;

  if(type.startsWith('(') && type.endsWith(')')) return parseType(type.slice(1).slice(0, -1));

  if(type === 'string') return 'rt.String';
  if(type === 'number') return 'rt.Number';
  if(type === 'boolean') return 'rt.Boolean';
  if(type === 'null') return 'rt.Null';
  if(type === 'undefined') return 'rt.Undefined';
  if(isStringLiteral(type)) {
    return `rt.Literal(${type})`;
  }


  if(type.endsWith('[]')) return `rt.Array(${parseType(type.slice(0, -2))})`;  

  throw `Unknown Type: ${type}`;
}

export function isStringLiteral(type: string): boolean {
  const wrappers = ['"', '\''];
  const first = type.substring(0,1);
  if(!wrappers.includes(first)) return false;
  if(!type.endsWith(first)) return false;
  if(type.slice(1).slice(0, -1).replace(new RegExp(`\\\\\\${first}`), '').includes(first)) return false;
  return true;
}

export function outBracketContains(target: string, lookup: string) {
  return countOutBracketContains(target, lookup) > 0;
}

export function countOutBracketContains(target: string, lookup: string) {
  return splitOutBracket(target, lookup).length - 1;
}

export function splitOutBracket(t: string, lookup: string | RegExp) {
  const result = [];
  let stack = '';
  let brackets = 0;
  for(let i = 0; i < t.length; i++) {
    if(t[i] === '(' || t[i] === '{') {
      brackets++;
    }
    if(t[i] === ')'|| t[i] === '}') {
      brackets--;
    }
    if(brackets === 0 && (typeof lookup === 'string' ? t[i] === lookup : lookup.test(t[i]))) {
      result.push(stack);
      stack = '';
      continue;
    }
    stack = `${stack}${t[i]}`;
  }
  result.push(stack);
  return result;
}

export function leftEval(t: string): { evalable: true, result: string } | { evalable: false } {
  const datas = ['|', '&'];
  if(datas.map(v => countOutBracketContains(t, v)).reduce((a, b) => a + b) <= 1) return { evalable: false };
  let result = '';
  let stack = '';
  let connector = '';
  let brackets = 0;
  for(let i = 0; i < t.length; i++) {
    if(t[i] === '(') {
      brackets++;
    }
    if(t[i] === ')') {
      brackets--;
    }
    if(brackets === 0 && datas.includes(t[i])) {
      result = `(${result}${connector}${stack})`;
      connector = t[i];
      stack = '';
      continue;
    }
    stack = `${stack}${t[i]}`;
  }
  result = `(${result}${connector}${stack})`;
  return { evalable: true, result };
}


