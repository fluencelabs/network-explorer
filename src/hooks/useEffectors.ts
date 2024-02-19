import { useApiQuery } from '.'

export const useEffectors = () => {
  const { data: effectors } = useApiQuery(
    (client) => client.getEffectors(0, 100),
    [],
    {
      key: 'effectors',
      ttl: 10_000 * 60, // 10 minute
    },
  )

  return effectors?.data ?? []
}
