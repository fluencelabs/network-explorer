import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Colors, colors } from '../constants/colors'

export interface TextProps {
  size?: number
  weight?: number
  color?: Colors
  uppercase?: boolean
  align?: string
}

export const Text = styled.span<TextProps>(
  ({
    size = 16,
    weight = 500,
    color = 'black900',
    uppercase = false,
    align = 'left',
  }) => css`
    font-size: ${size}px;
    font-weight: ${weight};
    line-height: ${size}px;
    color: ${colors[color]};
    text-align: ${align};
    text-transform: ${uppercase ? 'uppercase' : 'none'};
  `,
)

export const ShrinkText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TextWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
