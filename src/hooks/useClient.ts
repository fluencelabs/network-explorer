import { useEffect, useState } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'

import { createContracts } from '../utils/createContracts'

import { SUBGRAPH_URL } from '../constants/config'

export const useClient = () => {
  const [client, setClient] = useState<DealExplorerClient>()

  useEffect(() => {
    ;(async () => {
      const client = await DealExplorerClient.create(
        createContracts(),
        SUBGRAPH_URL,
      )
      setClient(client)
    })()
  }, [])

  return client
}
