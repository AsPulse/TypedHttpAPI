
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

/** Request sent by TypedHTTPAPI to a user-implemented API. */
export class HttpAPIRequest<Raw> {
  constructor(
    private received: HttpRequest<Raw>,
  ) {}

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

