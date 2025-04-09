import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { useClient } from './useClient'

export function useApiQuery<TData>(
  queryKey: string | string[],
  queryFn: (client: DealExplorerClient) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>,
) {
  const client = useClient()

  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => {
      if (!client) {
        throw new Error('Client not initialized')
      }
      return queryFn(client)
    },
    enabled: !!client,
    ...options,
  })
}
