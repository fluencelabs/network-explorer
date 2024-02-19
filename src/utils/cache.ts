const promiseCache = new Map()
const responseCache = new Map()

const buildCache = <TData>(cacheKey: string, cache: Map<string, TData>) => ({
  forget: () => cache.delete(cacheKey),
  get: () => cache.get(cacheKey),
  set: (data: TData) => cache.set(cacheKey, data),
})

const getCache = <TData>(cacheKey: string) => {
  const promise = buildCache<Promise<TData>>(cacheKey, promiseCache)
  const response = buildCache<{ created: number; data: TData }>(
    cacheKey,
    responseCache,
  )

  return {
    forget: () => {
      promise.forget()
      response.forget()
    },
    promise,
    response,
  }
}

export interface CacheParameters {
  key: string
  ttl?: number
}

export const cached = async <TData>(
  fn: () => Promise<TData>,
  { key, ttl = Infinity }: CacheParameters,
) => {
  const cache = getCache<TData>(key)

  const response = cache.response.get()

  if (response && ttl > 0) {
    const age = Date.now() - response.created

    if (age < ttl) {
      return response.data
    }
  }

  let promise = cache.promise.get()

  if (!promise) {
    promise = fn()

    cache.promise.set(promise)
  }

  try {
    const data = await promise

    cache.response.set({
      created: Date.now(),
      data,
    })

    return data
  } finally {
    cache.promise.forget()
  }
}
