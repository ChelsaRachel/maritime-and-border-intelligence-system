const mockClient = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`/data/${path}`)
    if (!response.ok) throw new Error(`Fixture lokal tidak tersedia: ${path}`)
    return response.json() as Promise<T>
  },
}

export default mockClient
