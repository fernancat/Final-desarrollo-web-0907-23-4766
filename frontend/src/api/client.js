const SESSION_HEADER = 'X-Session-Expires-At';

let sessionRenewedListener = null;
let unauthorizedListener = null;

export class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function onSessionRenewed(listener) {
  sessionRenewedListener = listener;
}

export function onUnauthorized(listener) {
  unauthorizedListener = listener;
}

async function readBody(response) {
  const contentType = response.headers.get('Content-Type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return await response.json();
}

async function send(path, method, body) {
  try {
    return await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No fue posible conectar con el servidor.');
  }
}

export async function request(path, options = {}) {
  const { method = 'GET', body, publicRoute = false } = options;

  const response = await send(path, method, body);
  const data = await readBody(response);

  const expiresAt = response.headers.get(SESSION_HEADER);

  if (expiresAt && sessionRenewedListener) {
    sessionRenewedListener(Number(expiresAt));
  }

  if (response.status === 401 && !publicRoute && unauthorizedListener) {
    unauthorizedListener(data?.message);
  }

  if (!response.ok) {
    const message = data?.message || 'No fue posible completar la solicitud.';
    throw new ApiError(response.status, message, data?.errors);
  }

  return data;
}
