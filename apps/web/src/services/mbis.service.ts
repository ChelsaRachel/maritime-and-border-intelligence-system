import { MOCK_ENDPOINTS } from '@/services/mock-endpoints'
import { mockRequest } from '@/services/mock.service'
import type { IMockEnvelope, TFixtureRecord } from '@/types/mbis'

function firstRecord(envelope: IMockEnvelope<TFixtureRecord>): TFixtureRecord {
  if (!envelope.metaData.status || !envelope.data[0]) throw new Error(`Fixture invalid: ${envelope.metaData.title}`)
  return envelope.data[0]
}

export const mbisService = {
  loadAll: async () => {
    const [overview, border, entities, operations] = await Promise.all([
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.OVERVIEW),
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.BORDER),
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.ENTITIES),
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.OPERATIONS),
    ])

    return {
      overview: firstRecord(overview),
      border: firstRecord(border),
      entities: firstRecord(entities),
      operations: firstRecord(operations),
    }
  },
}
