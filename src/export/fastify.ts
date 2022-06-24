import type { TypedAPIExports } from '.';

import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { HttpRequestMethod } from '../interface/httpMethod';

export class TypedAPIFastify {
  constructor(public exports: TypedAPIExports<FastifyRequest>){}

  register(fastify: FastifyInstance) {
    this.exports.apis.forEach(api => {
      const route = ((v: HttpRequestMethod) => {
        if(v === 'POST') return fastify.post;
        if(v === 'PUT') return fastify.put;
        if(v === 'DELETE') return fastify.delete;
        if(v === 'PATCH') return fastify.patch;
        return fastify.get;
      })(api.method);

      route(api.uri, async (request, reply) => {
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
