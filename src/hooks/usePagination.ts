import { useState } from 'react'

export const usePagination = (perPage: number) => {
  const [page, setPage] = useState(1)

  const selectPage = (newPage: number) => {
    setPage(() => newPage)
  }

  const getTotalPages = (totalItems: string | null) => {
    if (!totalItems) {
      return -1
    }

    return Math.ceil(parseInt(totalItems) / perPage)
  }

  return {
    page,
    selectPage,
    getTotalPages,
    offset: (page - 1) * perPage,
    limit: perPage,
  }
}
