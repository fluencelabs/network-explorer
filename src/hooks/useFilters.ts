import { useState } from 'react'
import { useSearch } from 'wouter/use-location'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFilters = <Filters extends Record<string, any>>(
  defaultFilters: Filters = {} as Filters,
) => {
  const search = useSearch()
  const urlParams = new URLSearchParams(search)
  const filter = urlParams.get('filter')
  const filtersData: Filters = filter
    ? ({ ...defaultFilters, status: filter } as unknown as Filters)
    : defaultFilters
  const [filters, setFilters] = useState<Filters>(filtersData)

  const handleChange = <FilterKey extends keyof Filters>(
    key: FilterKey,
    value?: Filters[FilterKey],
  ) => {
    const filtersCopy = { ...filters }

    delete filtersCopy[key]

    if (typeof value !== 'undefined' && value !== '') {
      filtersCopy[key] = value
    }

    setFilters(filtersCopy)
    if (filtersCopy[key] && typeof filtersCopy[key] === 'string') {
      const url = new URL(window.location.href)
      url.searchParams.set('filter', filtersCopy[key])
      window.history.pushState({}, '', url.toString())
    }
  }

  const reset = () => {
    setFilters({} as Filters)
    // remove filter from address string
    const url = new URL(window.location.href)
    url.searchParams.delete('filter')
    window.history.pushState({}, '', url.toString())
  }

  return [filters, handleChange, reset] as const
}
