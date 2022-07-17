export type IHttpCookie = {
  name: string,
  value: string
}

export type IHttpSetCookie = {
  name: string,
  value: string,

  /**
   * Cookie expiration date
   * 
   * (If you want, maxAge can be used to specify the number of seconds until the expiration date.)
   * (If both maxAge and expires are specified, maxAge takes precedence.)
   */
  expires?: Date,

  /**
   * "Seconds" to expiration date.
   * 
   * (If both maxAge and expires are specified, maxAge takes precedence.)
   */
  maxAge?: number,


  /**
   * The host to which the cookie will be sent.
   * If not specified, it defaults to the hostname portion of the current document URL, not including subdomains.
   */
  domain?: string,

  /**
   * The path that should be included in the URL of the request.
   */
  path?: string,

  httpOnly?: boolean

} & (
  {
    sameSite?: undefined,
    secure: boolean,
  } | {
    /**
     * If sameSite  is 'None', { secure: true } will be required.
     */
    sameSite: 'None',
    secure: true,
  } | {
    sameSite: 'Lax' | 'Strict',
    secure?: boolean
  }
);

