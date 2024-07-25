import { getDeployment } from '@fluencelabs/deal-ts-clients'
import { toFunctionSelector } from 'viem'
import { useCall } from 'wagmi'

import { FLUENCE_CLIENT_NETWORK, WAGMI_CONFIG } from '../constants/config'

export const useCurrentEpoch = () => {
  const result = useCall({
    config: WAGMI_CONFIG,
    to: getDeployment(FLUENCE_CLIENT_NETWORK).core as `0x${string}`,
    data: toFunctionSelector('currentEpoch()'),
  })
  console.log('use current epoch result:', result)
  console.dir(result)
  return result
}
