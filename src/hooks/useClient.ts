import { useMemo } from 'react'

import { DealExplorerClient } from '../clients/dealExplorerClient'
import { RPC_URL } from '../constants/config'
import { useAppStore } from '../store'

export const useClient = () => {
  const network = useAppStore((s) => s.network)

  return useMemo(() => {
    return new DealExplorerClient(network, RPC_URL[network], undefined)
  }, [network])
}
