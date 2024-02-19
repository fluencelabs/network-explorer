import styled from '@emotion/styled'

export const Space = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width ?? '0px'};
  height: ${({ height }) => height ?? '0px'};
`
