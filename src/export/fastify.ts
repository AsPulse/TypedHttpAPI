import type { TypedAPIExports } from '.';

import type { FastifyInstance, FastifyRequest, RouteHandlerMethod } from 'fastify';
import type { HttpRequestMethod } from '../interface/httpMethod';
import type { APIImplementOption } from '../interface/api';

export class TypedAPIFastify {
  constructor(public exports: TypedAPIExports<FastifyRequest>){}

  private static option: APIImplementOption = {
    incorrectTypeMessage: {
      code: 400, 
      data: {
        message: 'The payload type is different from schema.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  };

  private static shortageMessage = {
    code: 501,
    data: {
      message: 'It exists in the API schema but is not implemented.',
      error: 'Not Implemented',
      statusCode: 501,
    },
  };

  register(fastify: FastifyInstance) {
    const route = ((v: HttpRequestMethod, path: string, handler: RouteHandlerMethod) => {
      if(v === 'POST') return fastify.post(path, handler);
      if(v === 'PUT') return fastify.put(path, handler);
      if(v === 'DELETE') return fastify.delete(path, handler);
      if(v === 'PATCH') return fastify.patch(path, handler);
      return fastify.get(path, handler);
    });
    this.exports.apis.forEach(api => {
      route(api.endpoint.method, api.endpoint.uri, async (request, reply) => {
        const implement = await api.processor(TypedAPIFastify.option)({
          header: request.headers,
          remoteAddress: request.ip,
          body: request.body,
          raw: request,
        });
        if(implement.cookie !== undefined) reply.header('Set-Cookie', implement.cookie);
        reply.code(implement.code);
        return implement.data;
      });
    });
    this.exports.shortages.forEach(endpoint => {
      route(endpoint.method, endpoint.uri, async (...[,reply]) => {
        const implement = TypedAPIFastify.shortageMessage;
        reply.code(implement.code);
        return implement.data;
      });
    });
  }
}
