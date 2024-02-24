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

  const getPageItems = <T>(items: T[]) => {
    const hasNextPage = items.length > perPage
    const pageItems = items.slice(0, perPage)

    return { hasNextPage, pageItems }
  }

  return {
    page,
    selectPage,
    getTotalPages,
    getPageItems,
    offset: (page - 1) * perPage,
    limit: perPage,
  }
}
