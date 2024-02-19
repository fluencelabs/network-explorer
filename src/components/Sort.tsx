// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react'
import styled from '@emotion/styled'

import { Select, SelectItem } from './Select'
import { Text } from './Text'

interface SortProps<T extends string> {
  items: SelectItem<T>[]
  value: T
  setValue: (value: T) => void
}

export const Sort = <T extends string>({
  items,
  value,
  setValue,
}: SortProps<T>) => {
  return (
    <Wrapper>
      <Text uppercase size={10} weight={700} color="grey400">
        Sort by
      </Text>
      <Select<T> value={value} onChange={setValue} items={items} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
