import { useEffect, useState } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'

import { formatNativeTokenValue, formatPaymentTokenValue } from '../utils'

import { FLUENCE_CLIENT_NETWORK, RPC_URL } from '../constants/config'

export const useClient = () => {
  const [client, setClient] = useState<DealExplorerClient>()

  useEffect(() => {
    ;(async () => {
      const client = await DealExplorerClient.create(FLUENCE_CLIENT_NETWORK, RPC_URL, undefined, {
        nativeTokenValueAdditionalFormatter: formatNativeTokenValue,
        paymentTokenValueAdditionalFormatter: formatPaymentTokenValue,
      })
      setClient(client)
    })()
  }, [])

  return client
}
