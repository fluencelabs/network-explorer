import { useState } from 'react'
import { useSearch } from 'wouter/use-location'

export const usePagination = (perPage: number) => {
  const urlParams = new URLSearchParams(useSearch())
  const pageParam = urlParams.get('page')
  const [page, setPage] = useState(() => (pageParam ? parseInt(pageParam) : 1))

  const selectPage = (newPage: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', newPage.toString())
    window.history.pushState({}, '', url.toString())
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
