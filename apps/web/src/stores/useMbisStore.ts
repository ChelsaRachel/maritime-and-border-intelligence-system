import { mbisService } from '@/services/mbis.service'
import type { IMbisFixtureState } from '@/types/mbis'
import { create } from 'zustand'

interface IMbisStore extends IMbisFixtureState {
  loading: boolean
  loaded: boolean
  error: string | null
  load: () => Promise<void>
}

export const useMbisStore = create<IMbisStore>((set, get) => ({
  overview: null,
  border: null,
  entities: null,
  operations: null,
  loading: false,
  loaded: false,
  error: null,
  load: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true, error: null })
    try {
      const fixtures = await mbisService.loadAll()
      set({ ...fixtures, loaded: true })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Gagal membaca fixture lokal' })
    } finally {
      set({ loading: false })
    }
  },
}))
