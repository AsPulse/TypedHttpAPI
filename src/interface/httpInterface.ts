import type { IHttpCookie, IHttpSetCookie } from './cookie';

/** Request received by TypedHTTPAPI from the HTTP server. */
export type HttpRequest<Raw> = {
  header: {
    cookie?: string | undefined,
    'x-forwarded-for'?: string | string[] | undefined,
    'user-agent'?: string | undefined,
  },
  remoteAddress: string,
  body: unknown,
  raw: Raw,
}

export type HttpResponse = {
  code: number,
  cookie?: string[],
  data: unknown,
};

/** Request sent by TypedHTTPAPI to a user-implemented API. */
export class HttpAPIRequest<Raw, ResponseType> {
  constructor(
    private received: HttpRequest<Raw>,
  ) {}

  private parsedCookie: IHttpCookie[] | null = null;

  response = new HttpAPIResponse<ResponseType>;

  cookie(name: string): IHttpCookie | undefined  {
    if ( this.parsedCookie === null ) {
      this.parsedCookie = this.received.header.cookie === undefined ? [] : 
        this.received.header.cookie.split('; ')
          .flatMap(v => {
            const data = v.split('=');
            if(data.length !== 2) return [];
            return [{
              name: data[0],
              value: data[1],
            }];
          });
    }
    return this.parsedCookie.find(v => v.name === name);
  }

  raw() { return this.received.raw; }

  userAgent() { return this.received.header['user-agent'] ?? undefined; }

  remote() {
    const forward = this.received.header['x-forwarded-for'];

    const searchTop
      = forward === undefined
        ? undefined
        : Array.isArray(forward) ? forward[0] : forward.split(',')[0];

    if(searchTop !== undefined) return searchTop;

    return this.received.remoteAddress;
  }

}

export class HttpAPIResponse<OutputType> {
  private _code: number| null = null;
  private _data: OutputType | null = null;
  private _cookie: string[] = [];

  setCookie(cookie: IHttpSetCookie) {
    this._cookie.push([
      `${cookie.name}=${cookie.value}`,
      cookie.expires !== undefined ? `Expires=${cookie.expires.toUTCString()}` : '',
      cookie.maxAge !== undefined ? `Max-Age=${cookie.maxAge}` : '',
      cookie.domain !== undefined ? `Domain=${cookie.domain}` : '',
      cookie.path !== undefined ? `Path=${cookie.path}` : '',
      cookie.sameSite !== undefined ? `SameSite=${cookie.sameSite}` : '',
      cookie.secure === true ? 'Secure' : '',
      cookie.httpOnly === true ? 'HttpOnly' : '',
    ].join('; '));
    return this;
  }

  code(code: number) {
    this._code = code;
    return this;
  }

  data(data: OutputType) {
    this._data = data;
    if(this._code === null) this._code = 200;
    return this;
  }

  static unpack<T>(response: HttpAPIResponse<T>): HttpResponse {
    return {
      code: response._code ?? 501,
      data: response._data ?? {},
      cookie: response._cookie ?? [],
    };
  }
}

