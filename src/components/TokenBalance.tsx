import React from 'react'

import { formatNativeTokenValue } from '../utils'

import { Text } from './Text'
import { TokenBadge } from './TokenBadge'

export default function TokenBalance({
  balance,
  symbol,
}: {
  balance: number | string
  symbol?: string
}) {
  return (
    <>
      <Text size={12}>{formatNativeTokenValue(String(balance))}</Text>
      <TokenBadge bg="black900">
        <Text size={10} weight={800} color="white">
          {symbol}
        </Text>
      </TokenBadge>
    </>
  )
}
