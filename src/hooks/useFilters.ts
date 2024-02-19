import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFilters = <Filters extends Record<string, any>>(
  defaultFilters: Filters = {} as Filters,
) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters)

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
  }

  const reset = () => {
    setFilters({} as Filters)
  }

  return [filters, handleChange, reset] as const
}
