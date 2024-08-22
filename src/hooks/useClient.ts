import { useEffect, useState } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'
import { DEFAULT_SERIALIZATION_SETTINGS } from '@fluencelabs/deal-ts-clients/dist/utils/serializers/tokens'

import { formatNativeTokenValue, formatPaymentTokenValue } from '../utils'

import { FLUENCE_CLIENT_NETWORK, RPC_URL } from '../constants/config'

export const useClient = () => {
  const [client, setClient] = useState<DealExplorerClient>()

  useEffect(() => {
    ;(async () => {
      const client = await DealExplorerClient.create(
        FLUENCE_CLIENT_NETWORK,
        RPC_URL,
        undefined,
        {
          ...DEFAULT_SERIALIZATION_SETTINGS,
          nativeTokenValueAdditionalFormatter: formatNativeTokenValue,
          paymentTokenValueAdditionalFormatter: formatPaymentTokenValue,
        },
      )
      setClient(client)
    })()
  }, [])

  return client
}
