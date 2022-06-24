import type { APIExport } from '..';

export class APIExports<Raw> {
  constructor(public apis: APIExport<Raw>[]){}
  
}
