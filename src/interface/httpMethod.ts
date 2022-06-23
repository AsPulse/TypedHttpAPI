export const HTTP_REQUEST_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
] as const;

export type HttpRequestMethod
  = (typeof HTTP_REQUEST_METHODS)[number];
