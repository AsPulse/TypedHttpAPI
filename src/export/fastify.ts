import type { TypedAPIExports } from '.';

import type { FastifyInstance, FastifyRequest, RouteHandlerMethod } from 'fastify';
import type { HttpRequestMethod } from '../interface/httpMethod';

export class TypedAPIFastify {
  constructor(public exports: TypedAPIExports<FastifyRequest>){}

  register(fastify: FastifyInstance) {
    const route = ((v: HttpRequestMethod, path: string, handler: RouteHandlerMethod) => {
      if(v === 'POST') return fastify.post(path, handler);
      if(v === 'PUT') return fastify.put(path, handler);
      if(v === 'DELETE') return fastify.delete(path, handler);
      if(v === 'PATCH') return fastify.patch(path, handler);
      return fastify.get(path, handler);
    });
    this.exports.apis.forEach(api => {
      route(api.method, api.uri, async (request, reply) => {
        const implement = await api.processor({
          header: request.headers,
          remoteAddress: request.ip,
          body: request.body,
          raw: request,
        });
        reply.code(implement.code);
        return implement.data;
      });
    });
  }
}
