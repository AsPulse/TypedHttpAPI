import { parseInterface } from './parseInterface';

export type FileProvider = (filePath: string) => Promise<string>;

export async function resolveSymbol(name: string, provider: FileProvider) {
  const data = await provider('./');
  const inFileDatas = parseInterface(data);
  const inFileSymbol = inFileDatas.find(v => v.name === name);
  if(inFileSymbol !== undefined) return inFileSymbol.value;
  return null;
}
