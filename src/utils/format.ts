import { formatUnits } from 'viem'

import {
  FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT,
  USDC_DECIMALS,
} from '../constants/config.ts'
import { CHAIN } from '../constants/config.ts'

export const format = (
  value: bigint,
  decimals: number,
  significantDecimals: number,
): string => {
  const number = formatUnits(value, decimals)

  const [integer, fraction] = number.split('.')

  if (fraction.length === 0) {
    return integer
  }

  const index = fraction.split('').findIndex((digit) => digit !== '0')

  return `${integer}.${'0'.repeat(index)}${fraction.slice(
    index,
    index + significantDecimals,
  )}`.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1') // replace trailing zeros
}

// Add custom rules to format USD-like token values here.
export const formatPaymentTokenValue = (value: string) => {
  // transform all 12.00000 -> to 12
  return parseFloat(value)
    .toFixed(FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT)
    .replace(/\.0+$/, '')
}

export default function formatTokenUnits(
  value: bigint,
  decimals?: number | bigint,
  maxDecimalDigits?: number,
) {
  const formattedValue = formatUnits(value, Number(decimals))

  let roundedValue = parseFloat(formattedValue)

  if (maxDecimalDigits !== undefined) {
    const factor = Math.pow(10, maxDecimalDigits)
    roundedValue = Math.ceil(roundedValue * factor) / factor
  }

  return roundedValue.toString()
}

export const formatNativeTokenValue = (value: bigint, maxDecimalDigits = 6) => {
  return formatTokenUnits(
    value,
    CHAIN.nativeCurrency.decimals,
    maxDecimalDigits,
  )
}

export const formatUSDcTokenValue = (value: bigint, maxDecimalDigits = 2) => {
  return formatTokenUnits(value, USDC_DECIMALS, maxDecimalDigits)
}

export const formatRoundedUSDcTokenValue = (
  value: bigint,
  maxDecimalDigits = 2,
) => {
  if (value < 10 ** (USDC_DECIMALS - maxDecimalDigits))
    return formatTokenUnits(value, USDC_DECIMALS, USDC_DECIMALS)
  return formatTokenUnits(value, USDC_DECIMALS, maxDecimalDigits)
}

export const formatFullUSDcTokenValue = (value: bigint) => {
  return formatTokenUnits(value, USDC_DECIMALS, USDC_DECIMALS)
}
