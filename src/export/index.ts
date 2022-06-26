import type { APIExport, StructuredEndPoint } from '../interface/api';
export { TypedAPIFastify } from './fastify';

export class TypedAPIExports<Raw> {
  constructor(public apis: APIExport<Raw>[], public shortages: StructuredEndPoint[]){}
}
