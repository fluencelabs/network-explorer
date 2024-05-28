import React from 'react'
import { GridLoader } from 'react-spinners'
import styled from '@emotion/styled'

import { colors } from '../constants/colors'

export const InfoLoader: React.FC = () => {
  return (
    <Centered>
      <GridLoader color={colors.blue} loading={true} size={15} />
    </Centered>
  )
}

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 42px;
`
