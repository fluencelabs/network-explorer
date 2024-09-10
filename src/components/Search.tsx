import React from 'react'
import styled from '@emotion/styled'

import { CloseSmallIcon, SearchIcon } from '../assets/icons'
import { media } from '../hooks/useMedia'

import { colors } from '../constants/colors'

interface SearchInputProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export const Search: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <SearchInput>
      <StyledSearchIcon />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
      />
      {!!value.length && <ClearIcon onClick={() => onChange('')} />}
    </SearchInput>
  )
}

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  background-color: ${colors.grey100};
  width: 450px;
  height: 32px;
  padding-left: 10px;
  position: relative;

  ${media.mobile} {
    width: 100%;
  }
`

const Input = styled.input`
  padding: 6px 36px 6px 6px;
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 14px;
  background: transparent;
  width: 100%;
  height: 100%;
`

const StyledSearchIcon = styled(SearchIcon)`
  cursor: pointer;
  width: 20px;
`

const ClearIcon = styled(CloseSmallIcon)`
  position: absolute;
  right: 12px;

  color: ${colors.grey400};
  cursor: pointer;
`
