import styled from '@emotion/styled'

import { media } from '../hooks/useMedia'

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${media.tablet} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: fit-content;
  }

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: fit-content;
  }
`
