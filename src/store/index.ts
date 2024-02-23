import { ContractsENV } from '@fluencelabs/deal-aurora'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  network: ContractsENV

  setNetwork: (value: ContractsENV) => void
}

export const useAppStore = create(
  persist<AppStore>(
    (set) => ({
      network: 'dar',

      setNetwork: (network) => set({ network }),
    }),
    {
      version: 1,
      name: 'fluence',
    },
  ),
)
