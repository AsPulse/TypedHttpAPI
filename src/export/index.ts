import type { APIExport } from '..';

export class TypedAPIExports<Raw> {
  constructor(public apis: APIExport<Raw>[]){}
}
