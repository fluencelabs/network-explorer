// To store business logic serializers.

// If provider does not approved: convert a name.
import {
  type SerializationSettings,
  tokenValueToRounded,
} from '@fluencelabs/deal-aurora/dist/utils/serializers.js'

import type { ComputeUnitWithCcDataBasicFragment } from '../indexerClient/queries/peers-query.generated.js'
import type { ComputeUnitStatus } from '../types/schemes.js'

export function serializeProviderName(
  name: string,
  providerAddress: string,
  isApproved: boolean,
): string {
  if (isApproved) {
    return name
  }
  if (providerAddress === '0x0000000000000000000000000000000000000000') {
    return 'Provider 0x0000000'
  }
  return 'Provider ' + providerAddress.slice(0, 8)
}

export function serializeCUStatus(
  computeUnitWithCcDataBasicFragment: ComputeUnitWithCcDataBasicFragment,
) {
  const computeUnit = computeUnitWithCcDataBasicFragment
  const currentPeerCapacityCommitment =
    computeUnit.peer.currentCapacityCommitment

  let status: ComputeUnitStatus = 'undefined'
  if (computeUnit.deal) {
    status = 'deal'
  } else if (currentPeerCapacityCommitment) {
    status = 'capacity'
  } else {
    status = 'undefined'
  }

  return {
    status,
  }
}

export function serializeRewards(
  value: bigint,
  delegatorRate: number,
  precision: number,
  serializationSettings: SerializationSettings,
): { provider: string; delegator: string } {
  const delegatorRateBigInt = BigInt(delegatorRate)
  const precisionBigInt = BigInt(precision)
  const delegatorReward = (value * delegatorRateBigInt) / precisionBigInt
  const providerReward = value - delegatorReward
  return {
    provider: tokenValueToRounded(
      providerReward,
      serializationSettings.parseNativeTokenToFixedDefault,
    ),
    delegator: tokenValueToRounded(
      delegatorReward,
      serializationSettings.parseNativeTokenToFixedDefault,
    ),
  }
}
