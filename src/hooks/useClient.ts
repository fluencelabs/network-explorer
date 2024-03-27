import { useMemo } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'

import {
  PARSE_NATIVE_TOKEN_TO_FIXED_DEFAULT,
  PARSE_TOKEN_TO_FIXED_DEFAULT,
  RPC_URL,
} from '../constants/config'
import { useAppStore } from '../store'

export const useClient = () => {
  const network = useAppStore((s) => s.network)

  return useMemo(() => {
    return new DealExplorerClient(network, RPC_URL[network], undefined, {
      parseNativeTokenToFixedDefault: PARSE_NATIVE_TOKEN_TO_FIXED_DEFAULT,
      parseTokenToFixedDefault: PARSE_TOKEN_TO_FIXED_DEFAULT,
    })
  }, [network])
}
