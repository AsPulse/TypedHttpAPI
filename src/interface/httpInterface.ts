
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
  data: unknown
};

/** Request sent by TypedHTTPAPI to a user-implemented API. */
export class HttpAPIRequest<Raw, ResponseType> {
  constructor(
    private received: HttpRequest<Raw>,
  ) {}

  response = new HttpAPIResponse<ResponseType>;

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
    };
  }
}

