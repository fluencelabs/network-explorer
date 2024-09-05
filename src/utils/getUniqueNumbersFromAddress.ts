import { keccak256, toHex } from 'viem'

import { Range } from '../typings/types'

export const getUniqueNumbersFromAddress = (
  address: string,
): { icon: Range<17>; color: Range<8> } => {
  const hash = keccak256(toHex(address))

  const iconHashPart = parseInt(hash.slice(2, 4), 16)
  const colorHashPart = parseInt(hash.slice(4, 6), 16)

  const icon: Range<17> = (iconHashPart % 17) as Range<17>
  const color: Range<9> = (colorHashPart % 8) as Range<8>

  return { icon, color }
}
