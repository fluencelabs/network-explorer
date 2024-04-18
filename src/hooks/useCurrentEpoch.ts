import { getDeployment } from '@fluencelabs/deal-ts-clients'
import { toFunctionSelector } from 'viem'
import { useCall } from 'wagmi'

import { CHAIN_NAME, WAGMI_CONFIG } from '../constants/config'

export const useCurrentEpoch = () => {
  const result = useCall({
    config: WAGMI_CONFIG,
    to: getDeployment(CHAIN_NAME).core as `0x${string}`,
    data: toFunctionSelector('currentEpoch()'),
  })
  return result
}
