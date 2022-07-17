import type { HttpRequestMethod } from '../interface/httpMethod';

interface TypedAPIExportSummary {
  apiCount: {
    method: HttpRequestMethod,
    count: number
  }[],
  doublingEndpoints: string[],
  shortageEndpoints: string[],
}

const bold = '\x1b[1m';
const magenta = '\x1b[35m';
const yellow = '\x1b[33m';
const gray = '\x1b[38;5;240m';
const green = '\x1b[32m';
const reset = '\x1b[0m';

export function generateSummary(data: TypedAPIExportSummary) {
  return [
    '',
    `${bold}${magenta}=== TypedAPI Export Summary ===${reset}`,
    '',
    '- Implemented API Counts:',
    ...keyValue(data.apiCount.flatMap(v => v.count > 0 ? [({ key: v.method, value: `${v.count} API(s)` })] : []), ['(No API implemented)']).map(v => `   ${v}`),
    '',
    ...(data.doublingEndpoints.length > 0 ? [
      `${yellow}${bold}- WARNING ${reset}${yellow}There are multiple implementations of the API below:${reset}`,
      ...data.doublingEndpoints.map(v => `   > ${v}`),
      `   ${gray}These behaviors depend on the server implementation.`,      
    ]: [
      `${green}- OK: No duplicate API implementations were detected.`,
    ]),
    '',
    ...(data.shortageEndpoints.length > 0 ? [
      `${yellow}${bold}- WARNING ${reset}${yellow}There are no implementations of the API below:${reset}`,
      ...data.shortageEndpoints.map(v => `   > ${v}`),
      `   ${gray}These return 501 Not Implemented.`,
    ]: [
      `${green}- OK: No APIs with no implementation were detected.`,
    ]),
    '',
    `${bold}${magenta}=== TypedAPI Export Summary ===${reset}`,
    '',
  ];
}

function keyValue(data: { key: string, value: string }[], noValue: string[]): string[] {
  if(data.length === 0) return noValue;
  const keyLen = data.map(v => v.key.length).reduce((a, b) => Math.max(a, b)) + 1;
  return data.map(v => 
    `${v.key}${' '.repeat(keyLen - v.key.length)}${v.value}`,
  );
}
