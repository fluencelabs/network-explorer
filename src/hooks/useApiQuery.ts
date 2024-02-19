import { useEffect, useState } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-aurora'

import { cached, CacheParameters } from '../utils'

import { useAppStore } from '../store'

import { useClient } from './useClient'

type ApiResult<T> = {
  data: T | undefined
  isLoading: boolean
  error: unknown
}

export const useApiQuery = <T>(
  fn: (client: DealExplorerClient) => Promise<T>,
  deps: React.DependencyList = [],
  cache?: CacheParameters,
) => {
  const client = useClient()
  const network = useAppStore((s) => s.network)
  const [result, setResult] = useState<ApiResult<T>>({
    data: undefined,
    isLoading: true,
    error: undefined,
  })

  const update = async () => {
    try {
      setResult({
        error: undefined,
        isLoading: true,
        data: result.data,
      })

      const data = await (cache
        ? cached(() => fn(client), {
            key: `${network}:${cache.key}`,
            ttl: cache.ttl,
          })
        : fn(client))

      setResult({
        error: undefined,
        isLoading: false,
        data,
      })
    } catch (error: unknown) {
      console.error(error)
      setResult({
        error,
        isLoading: false,
        data: result.data,
      })
    }
  }

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, ...deps])

  return {
    update,
    ...result,
  }
}
