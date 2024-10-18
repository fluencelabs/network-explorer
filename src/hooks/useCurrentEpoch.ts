import { toFunctionSelector } from 'viem'
import { useCall } from 'wagmi'

import { DEPLOYMENT, WAGMI_CONFIG } from '../constants/config'

export const useCurrentEpoch = () => {
  const result = useCall({
    config: WAGMI_CONFIG,
    to: DEPLOYMENT.diamond as `0x${string}`,
    data: toFunctionSelector('currentEpoch()'),
  })
  return result
}
