import { formatUnits } from 'viem'

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
