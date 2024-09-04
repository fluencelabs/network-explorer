import { useEffect, useState } from 'react'
import { StakerClient } from '@fluencelabs/deal-ts-clients'
import { DEFAULT_SERIALIZATION_SETTINGS } from '@fluencelabs/deal-ts-clients/dist/utils/serializers/tokens'

import { formatNativeTokenValue, formatPaymentTokenValue } from '../utils'

import { FLUENCE_CLIENT_NETWORK, RPC_URL } from '../constants/config'

export const useStakerClient = () => {
  const [client, setClient] = useState<StakerClient>()

  useEffect(() => {
    ;(async () => {
      const client = await StakerClient.create(
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
