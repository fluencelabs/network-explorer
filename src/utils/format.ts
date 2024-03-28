import { formatUnits } from 'viem'

import {
  FORMAT_NATIVE_TOKEN_TO_FIXED_DEFAULT,
  FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT,
} from '../constants/config.ts'

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

// Add custom rules to format native FLT token values here.
export const formatNativeTokenValue = (value: string) => {
  // transform all 12.00000 -> to 12.0
  return parseFloat(value)
    .toFixed(FORMAT_NATIVE_TOKEN_TO_FIXED_DEFAULT)
    .replace(/\.0+$/, '.0')
}

// Add custom rules to format USD-like token values here.
export const formatPaymentTokenValue = (value: string) => {
  // transform all 12.00000 -> to 12
  return parseFloat(value)
    .toFixed(FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT)
    .replace(/\.0+$/, '')
}
