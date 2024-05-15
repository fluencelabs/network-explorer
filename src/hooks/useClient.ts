import { useMemo } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'

import { formatNativeTokenValue, formatPaymentTokenValue } from '../utils'

import { FLUENCE_CLIENT_NETWORK, RPC_URL } from '../constants/config'

export const useClient = () => {
  return useMemo(() => {
    return new DealExplorerClient(FLUENCE_CLIENT_NETWORK, RPC_URL, undefined, {
      nativeTokenValueAdditionalFormatter: formatNativeTokenValue,
      paymentTokenValueAdditionalFormatter: formatPaymentTokenValue,
    })
  }, [])
}
