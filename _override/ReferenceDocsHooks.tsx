// Prepend `SSWS` for any request using an API token
export function requestInterceptor(req, operation) {
  console.log('operation:', operation);

  req.headers['Authorization'] = 'SSWS ' + req.headers['Authorization'];

  return req;
}