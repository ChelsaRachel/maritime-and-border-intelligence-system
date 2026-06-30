/**
 * Deferred integration boundary.
 *
 * MBIS Sprint 12 is frontend-only. This compatibility surface exists solely so
 * untouched boilerplate modules keep their types; every operation rejects before
 * any network request can be created. Application features use mock-client.ts.
 */

function deferred<T>(): Promise<T> {
  return Promise.reject(new Error('Real API access is deferred. MBIS frontend uses local fixtures only.'))
}

const apiClient = {
  request: <T = unknown>(_config: unknown): Promise<T> => deferred<T>(),
  get: <T = unknown>(_path: string, _config?: unknown): Promise<T> => deferred<T>(),
  post: <T = unknown>(_path: string, _data?: unknown, _config?: unknown): Promise<T> => deferred<T>(),
  put: <T = unknown>(_path: string, _data?: unknown, _config?: unknown): Promise<T> => deferred<T>(),
  patch: <T = unknown>(_path: string, _data?: unknown, _config?: unknown): Promise<T> => deferred<T>(),
  delete: <T = unknown>(_path: string, _config?: unknown): Promise<T> => deferred<T>(),
}

export default apiClient
