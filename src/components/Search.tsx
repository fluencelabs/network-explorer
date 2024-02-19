import React from 'react'
import styled from '@emotion/styled'

import { SearchIcon } from '../assets/icons'

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
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
      />
      <StyledSearchIcon />
    </SearchInput>
  )
}

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  background-color: ${colors.grey100};
  width: 400px;
  height: 32px;
  padding-right: 12px;
`

const Input = styled.input`
  padding: 6px 10px;
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
`
