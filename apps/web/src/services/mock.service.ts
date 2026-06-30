import mockClient from '@/services/mock-client'

export function mockRequest<T>(path: string): Promise<T> {
  return mockClient.get<T>(path)
}
