import React from 'react'
import styled from '@emotion/styled'

import { ArrowIcon } from '../assets/icons'

import { colors } from '../constants/colors'

import { Text } from './Text'
import { Hide } from './Visibility'

interface PaginationProps {
  pages: number
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
  if (page === 1 && pages === -1 && !hasNextPage) {
    return null
  }

  return (
    <Wrapper>
      <Hide if={isFirstPage}>
        <Button onClick={() => onSelect(1)}>
          <Text>First</Text>
        </Button>

        <Button onClick={() => onSelect(page - 1)}>
          <LeftArrowIcon />
        </Button>
      </Hide>

      <Button>
        <MonospaceText>
          <Hide if={pages === -1}>
            Page {page} of {pages}
          </Hide>
          <Hide if={pages !== -1}>{page}</Hide>
        </MonospaceText>
      </Button>

      <Hide if={isLastPage || !hasNextPage}>
        <Button onClick={() => onSelect(page + 1)}>
          <ArrowIcon />
        </Button>
        <Hide if={pages === -1}>
          <Button onClick={() => onSelect(pages)}>
            <Text>Last</Text>
          </Button>
        </Hide>
      </Hide>
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
