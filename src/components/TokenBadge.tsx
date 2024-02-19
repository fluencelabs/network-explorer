import styled from '@emotion/styled'

import { Colors, colors } from '../constants/colors'

export const TokenBadge = styled.div<{ bg?: Colors }>`
  display: flex;
  align-items: center;
  background-color: ${({ bg = 'grey200' }) => colors[bg]};
  border-radius: 4px;
  padding: 0 6px;
  height: 16px;
`
