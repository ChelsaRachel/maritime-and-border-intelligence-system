import { MOCK_ENDPOINTS } from '@/services/mock-endpoints'
import { mockRequest } from '@/services/mock.service'
import type { IMockEnvelope, TFixtureRecord } from '@/types/mbis'
import type { INmpEntitiesFixture, INmpGeographyFixture, INmpIntelligenceFixture, INmpReplayFixture } from '@/features/mbis/types/nmp.types'

function firstRecord<T>(envelope: IMockEnvelope<T>): T {
  if (!envelope.metaData.status || !envelope.data[0]) throw new Error(`Fixture invalid: ${envelope.metaData.title}`)
  return envelope.data[0]
}

export const mbisService = {
  loadAll: async () => {
    const [overview, border, entities, operations, nmpEntities, nmpGeography, nmpIntelligence, nmpReplay] = await Promise.all([
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.OVERVIEW),
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.BORDER),
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.ENTITIES),
      mockRequest<IMockEnvelope<TFixtureRecord>>(MOCK_ENDPOINTS.OPERATIONS),
      mockRequest<IMockEnvelope<INmpEntitiesFixture>>(MOCK_ENDPOINTS.NMP_ENTITIES),
      mockRequest<IMockEnvelope<INmpGeographyFixture>>(MOCK_ENDPOINTS.NMP_GEOGRAPHY),
      mockRequest<IMockEnvelope<INmpIntelligenceFixture>>(MOCK_ENDPOINTS.NMP_INTELLIGENCE),
      mockRequest<IMockEnvelope<INmpReplayFixture>>(MOCK_ENDPOINTS.NMP_REPLAY),
    ])

    return {
      overview: firstRecord(overview),
      border: firstRecord(border),
      entities: firstRecord(entities),
      operations: firstRecord(operations),
      nmpEntities: firstRecord(nmpEntities) as INmpEntitiesFixture,
      nmpGeography: firstRecord(nmpGeography) as INmpGeographyFixture,
      nmpIntelligence: firstRecord(nmpIntelligence) as INmpIntelligenceFixture,
      nmpReplay: firstRecord(nmpReplay) as INmpReplayFixture,
    }
  },
}
