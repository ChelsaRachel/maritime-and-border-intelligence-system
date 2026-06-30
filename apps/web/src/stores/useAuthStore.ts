import type { IUserSession } from '@/types/mbis'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IAuthStore {
  user: IUserSession | null
  isAuthenticated: boolean
  setSession: (user: IUserSession) => void
  clearSession: () => void
  clearAuth: () => void
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user) => set({ user, isAuthenticated: true }),
      clearSession: () => set({ user: null, isAuthenticated: false }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'mbis-demo-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
