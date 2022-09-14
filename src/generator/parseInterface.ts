export function parseInterface(s: string): { name: string, value: string }[] {  
  let status: { at: 'none' } | { 
    at: 'declaringType' | 'declaringInterface',
    startPoint: number,
  } | {
    at: 'inner',
    from: 'type' | 'interface',
    startPoint: number,
    name: string,
    brackets: number,
  } = { at: 'none' };

  const list: { name: string, value: string }[] = [];

  for(let i = 0; i < s.length; i++) {
    switch (status.at) {
    case 'none':
      if(checkBackwards(s, i, 'type ')) {
        status = {
          at: 'declaringType',
          startPoint: i,
        };
      }
      if(checkBackwards(s, i, 'interface ')) {
        status = {
          at: 'declaringInterface',
          startPoint: i,
        };
      }
      break;
    case 'declaringType': {
      const name = removeBothEndsSpace(getBackwards(s, i - 1, i - status.startPoint));
      if(s[i] === '=') {
        status = {
          at: 'inner',
          name,
          from: 'type',
          startPoint: i,
          brackets: 0,
        };
      }
      if(s[i] === ';') status = { at: 'none' };
      break;
    }
    case 'declaringInterface': {
      const name = removeBothEndsSpace(getBackwards(s, i - 1, i - status.startPoint));
      if(s[i] === '{') {
        status = {
          at: 'inner',
          name,
          from: 'interface',
          startPoint: i - 1,
          brackets: 1,
        };
      }
      if(s[i] === ';') status = { at: 'none' };
      break;
    }
    case 'inner': {
      if(s[i] === '{') {
        status.brackets++;
      }
      if(s[i] === '}') {
        status.brackets--;
      }
      const data = getBackwards(s, i - ( status.from === 'type' ? 1 : 0 ), i - status.startPoint - ( status.from === 'type' ? 1 : 0 ));

      if(status.brackets === 0 && (((s[i] === ';' || s[i] === '\n') && data.length > 0) || status.from === 'interface')) {
        list.push({
          name: status.name,
          value: removeBothEndsSpace(data),
        });
        status = { at: 'none' };
      }
      break;
    }
    }
  }
  return list;
}

export function checkBackwards(target: string, index: number, looking: string) {
  return getBackwards(target, index, looking.length) === looking;
}

export function getBackwards(target: string, index: number, length: number) {
  return target.substring(index - length + 1, index + 1);
}

export function removeBothEndsSpace(s: string) {
  return s.replace(/^(\s*)(.*?)(\s*)$/s, '$2');
}
