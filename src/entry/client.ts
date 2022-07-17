import type { Static } from 'runtypes/lib/runtype';
import type { HttpRequestMethod } from '../interface/httpMethod';
import type { APIEndPoint, APISchema } from '../interface/schema';
import { parseEndPoint } from '../util/parseEndPoint';

export class TypedHttpAPI<APISchemaType extends APISchema> {
  private uriPrefix = '';

  customServerAddress(address: string) {
    this.uriPrefix = address;
    return this;
  }

  open<T extends keyof APISchemaType & APIEndPoint>(endpoint: T, data: Static<APISchemaType[T]['request']>, withCredentials = false) {
    const target = parseEndPoint(endpoint);
    return new TypedHttpAPIRequest<
      Static<APISchemaType[T]['request']>,
      Static<APISchemaType[T]['response']>
    >(target.method, this.uriPrefix + target.uri, data, withCredentials);
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
class TypedHttpAPIRequest<RequestPayload extends Record<string, unknown>, ResponsePayload> {
  private xhr = new XMLHttpRequest();
  private _judge: Judger<ResponsePayload> = response => 200 <= response.code && response.code < 300 || response.code === 304;

  constructor(method: HttpRequestMethod, uri: string, private data: RequestPayload, private withCredentials: boolean) {
    this.xhr.open(method, uri);
    this.xhr.timeout = 10000;
    this.xhr.withCredentials = this.withCredentials;
  }

  judge(judger: Judger<ResponsePayload>) {
    this._judge = judger;
    return this;
  }

  timeout(timeout: number) {
    this.xhr.timeout = timeout;
    return this;
  }
  
  async fetch() {
    return new Promise<Response<ResponsePayload>>((resolve, reject: (reason: FailedResponse<ResponsePayload>) => void) => {
      const rejectWith = (reason: Exclude<FailedResponse<unknown>['reason'], 'judge'>) => reject({ reason });
      (xhr => {
        xhr.addEventListener('load', () => {
          try {
            const jsonPayload = JSON.parse(xhr.responseText) as unknown;
            const response: Response<ResponsePayload> = {
              code: xhr.status,
              body: jsonPayload as ResponsePayload,
            };
            const judge = this._judge(response);
            if(!judge) {
              reject({ reason: 'judge', response });
              return;
            }
            resolve(response);
          } catch {
            rejectWith('json');
          }
        });
        xhr.addEventListener('timeout', () => rejectWith('timeout'));
        xhr.addEventListener('error', () => rejectWith('error'));

        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8' );
        xhr.send(JSON.stringify(this.data));
      })(this.xhr);
    });
  }
}
