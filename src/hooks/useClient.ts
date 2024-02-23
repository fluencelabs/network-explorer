import { useMemo } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-aurora'

import { RPC_URL } from '../constants/config'
import { useAppStore } from '../store'

export const useClient = () => {
  const network = useAppStore((s) => s.network)

  return useMemo(() => {
    console.log(network)
    return new DealExplorerClient(network, RPC_URL[network], undefined)
  }, [network])
}
