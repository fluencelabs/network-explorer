import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'wouter'

import { colors } from '../constants/colors'

import { Text } from './Text'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <Wrapper>
      {items.map((item, index) => {
        if (index === items.length - 1 || !item.path) {
          return (
            <Text size={12} color="grey400" key={item.label}>
              {item.label}
            </Text>
          )
        }

        return (
          <StyledLink key={item.path} href={item.path}>
            {item.label}
          </StyledLink>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
`

const StyledLink = styled(Link)`
  color: ${colors.black900};

  &:after {
    content: '/';
    display: inline-block;
    padding-left: 8px;
    color: ${colors.grey400};
  }
`
