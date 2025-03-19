import React from 'react'
import styled from '@emotion/styled'

import { ArrowIcon } from '../assets/icons'

import { colors } from '../constants/colors'

import { Text } from './Text'

interface PaginationProps {
  pages: number | null
  page: number
  hasNextPage?: boolean
  onSelect: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pages,
  hasNextPage = true,
  onSelect,
}) => {
  const isFirstPage = page === 1
  const isLastPage = page === pages

  // If there is only one page, don't show pagination
  if (page === 1 && (pages === null || pages === 0) && !hasNextPage) {
    return null
  }

  return (
    <Wrapper>
      {!isFirstPage && (
        <>
          <Button onClick={() => onSelect(1)}>
            <Text>First</Text>
          </Button>

          <Button onClick={() => onSelect(page - 1)}>
            <LeftArrowIcon />
          </Button>
        </>
      )}

      <Button>
        <MonospaceText>
          {pages === null ? page : `Page ${page} of ${pages}`}
        </MonospaceText>
      </Button>

      {!isLastPage && hasNextPage && (
        <>
          <Button onClick={() => onSelect(page + 1)}>
            <ArrowIcon />
          </Button>
          {pages !== null && (
            <Button onClick={() => onSelect(pages)}>
              <Text>Last</Text>
            </Button>
          )}
        </>
      )}
    </Wrapper>
  )
}

interface LoadMorePaginationProps {
  page: number
  hasNextPage?: boolean
  onNext: () => void
  onPrev: () => void
  onFirst: () => void
}

export const LoadMorePagination: React.FC<LoadMorePaginationProps> = ({
  page,
  hasNextPage = true,
  onNext,
  onPrev,
  onFirst,
}) => {
  const isFirstPage = page === 1

  return (
    <Wrapper>
      {!isFirstPage && (
        <>
          <Button onClick={() => onFirst()}>
            <Text>First</Text>
          </Button>

          <Button onClick={() => onPrev()}>
            <LeftArrowIcon />
          </Button>
        </>
      )}

      <Button>
        <MonospaceText>{page}</MonospaceText>
      </Button>

      {hasNextPage && (
        <>
          <Button onClick={() => onNext()}>
            <ArrowIcon />
          </Button>
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 2px;
`

const Button = styled.button`
  all: unset;
  border-radius: 8px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${colors.grey200};
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
`

const LeftArrowIcon = styled(ArrowIcon)`
  transform: rotate(180deg);
`

const MonospaceText = styled(Text)`
  font-variant-numeric: tabular-nums;
`
