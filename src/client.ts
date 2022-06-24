import type { TypeOf } from 'io-ts';
import type { HttpRequestMethod } from './interface/httpMethod';
import type { APIEndPoint, APISchema } from './interface/schema';
import { parseEndPoint } from './util/parseEndPoint';

export class TypedHttpAPI<APISchemaType extends APISchema> {
  private uriPrefix = '';

  customServerAddress(address: string) {
    this.uriPrefix = address;
  }

  open<T extends keyof APISchemaType & APIEndPoint>(endpoint: T, data: TypeOf<APISchemaType[T]['request']>) {
    const target = parseEndPoint(endpoint);
    return new TypedHttpAPIRequest<
      TypeOf<APISchemaType[T]['request']>,
      TypeOf<APISchemaType[T]['response']>
    >(target.method, this.uriPrefix + target.uri, data);
  }
}

type Response<Payload> = {
  code: number, body: Payload
};

type FailedResponse<Payload> = {
  reason: 'judge',
  response: Response<Payload>
} | { reason: 'timeout' | 'error' | 'json' };

type Judger<Payload> = (response: Response<Payload>) => boolean;
export class TypedHttpAPIRequest<RequestPayload extends Record<string, unknown>, ResponsePayload> {
  xhr = new XMLHttpRequest();
  private _judge: Judger<ResponsePayload> = response => 200 <= response.code && response.code < 300 || response.code === 304;
  private _timeout = 10000;

  constructor(method: HttpRequestMethod, uri: string, private data: RequestPayload) {
    this.xhr.open(method, uri);
  }

  judge(judger: Judger<ResponsePayload>) {
    this._judge = judger;
    return this;
  }

  timeout(timeout: number) {
    this._timeout = timeout;
    return this;
  }
  
  async sendAndGet() {
    return new Promise<Response<ResponsePayload>>((resolve, reject: (reason: FailedResponse<ResponsePayload>) => void) => {
      this.xhr.addEventListener('load', () => {
        try {
          const jsonPayload = JSON.parse(this.xhr.responseText) as unknown;
          const response: Response<ResponsePayload> = {
            code: this.xhr.status,
            body: jsonPayload as ResponsePayload,
          };
          const judge = this._judge(response);
          if(!judge) {
            reject({ reason: 'judge', response });
            return;
          }
          resolve(response);
          return;
        } catch {
          reject({ reason: 'json' });
          return;
        }
      });
      this.xhr.addEventListener('timeout', () => {
        reject({ reason: 'timeout' });
      });
      this.xhr.addEventListener('error', () => {
        reject({ reason: 'error' });
      });

      this.xhr.timeout = this._timeout;
      this.xhr.send(JSON.stringify(this.data));
    });
  }
}
