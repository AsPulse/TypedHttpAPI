import type { APIExport } from '../interface/api';

export class TypedAPIExports<Raw> {
  constructor(public apis: APIExport<Raw>[]){}
}
