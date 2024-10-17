import React from 'react'

import { formatNativeTokenValue, formatUSDcTokenValue } from '../utils'

import { CHAIN } from '../constants/config'

import { Text } from './Text'
import { TokenBadge } from './TokenBadge'

export default function TokenBalance({
  balance,
  symbol = CHAIN.nativeCurrency.symbol,
}: {
  balance: bigint
  symbol?: string
}) {
  return (
    <>
      <Text size={12}>
        {symbol === CHAIN.nativeCurrency.symbol
          ? formatNativeTokenValue(balance)
          : formatUSDcTokenValue(balance)}
      </Text>
      <TokenBadge bg="black900">
        <Text size={10} weight={800} color="white">
          {symbol}
        </Text>
      </TokenBadge>
    </>
  )
}
