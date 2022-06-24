export function detectDuplicate<T>(a: T[]): T[] {
  return a.filter((v, i, arr) => arr.indexOf(v) === i && arr.lastIndexOf(v) !== i);
}
