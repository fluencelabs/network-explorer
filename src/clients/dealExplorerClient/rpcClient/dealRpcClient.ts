import {
  Capacity__factory,
  Deal__factory,
  IMulticall3__factory,
} from '@fluencelabs/deal-aurora'
import { type Multicall3ContractCall } from '@fluencelabs/deal-aurora/dist/utils/rpcClientABC'
import type { ethers } from 'ethers'

import type { CapacityCommitmentStatus } from '../types/schemes.js'

import {
  serializeTxCapacityCommitmentStatus,
  serializeTxDealStatus,
  serializeTxToBigInt,
} from './serializers.js'

// TODO: This class should be imported directly from TS client. To do so, this class should be exported from top level index.js in ts-client.
// NOTE: The types any there don't matter.

class Multicall3ContractClientABC {
  _caller
  _multicall3Contract
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(caller: any, multicall3ContractAddress: any) {
    this._caller = caller
    this._multicall3Contract = IMulticall3__factory.connect(
      multicall3ContractAddress,
      this._caller,
    )
  }
  /*
   * @dev Put arrays of encoded calls and other data to decode and convert responses:
   * @dev - callResultsInterfaces
   * @dev - contractMethods
   * @dev - txResultsConverters
   * @dev Note, If one of the transaction is reverted it sends null to txResultsConverter.
   * @dev  Thus, null should be caught appropriate in a supplied txResultsConverter.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async _callBatch(
    callsEncoded: any,
    callResultsInterfaces: any,
    contractMethods: any,
    txResultsConverters: any,
  ) {
    if (
      (callsEncoded.length +
        callResultsInterfaces.length +
        contractMethods.length +
        txResultsConverters.length) %
        4 !=
      0
    ) {
      throw new Error(
        'Assertion: callsEncoded, callResultsInterfaces, contractMethods, txResultsConverters should have the same length.',
      )
    }

    const multicallContractCallResults =
      await this._multicall3Contract.aggregate3.staticCall(callsEncoded)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedResults: any[] = []
    for (let i = 0; i < multicallContractCallResults.length; i++) {
      const txResultsConverter = txResultsConverters[i]
      const contractMethod = contractMethods[i]
      const callResultsInterface = callResultsInterfaces[i]
      if (
        txResultsConverter == undefined ||
        contractMethod == undefined ||
        callResultsInterface == undefined
      ) {
        throw new Error(
          'Assertion: txResultsConverter or contractMethod or callResultsInterface is undefined.',
        )
      }
      const rawResult = multicallContractCallResults[i]
      if (rawResult == undefined || !rawResult.success) {
        decodedResults.push(txResultsConverter(null))
        continue
      }
      const rawReturnData = rawResult.returnData

      const decoded = callResultsInterface.decodeFunctionResult(
        contractMethod,
        rawReturnData,
      )

      decodedResults.push(txResultsConverter(decoded))
    }
    return decodedResults
  }
  // Basic implementation of TxResultsConverter.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _decodeToString(result: any, defaultNoResult = '') {
    if (!result) {
      return defaultNoResult
    }
    return result.toString()
  }
}

export class DealRpcClient extends Multicall3ContractClientABC {
  constructor(
    caller: ethers.Provider | ethers.Signer,
    multicall3ContractAddress: string,
  ) {
    super(caller, multicall3ContractAddress)
  }

  // Get statuses for batch of Deals by 1 call.
  async getStatusDealBatch(dealAddresses: Array<string>) {
    if (dealAddresses[0] == undefined) {
      return []
    }

    // We need any of the deal contract coz we will use interface of the Deal only.
    const contractInstance = Deal__factory.connect(
      dealAddresses[0],
      this._caller,
    )
    const contractMethod = 'getStatus'
    const callEncoded =
      contractInstance.interface.encodeFunctionData(contractMethod)
    const callsEncoded: Multicall3ContractCall[] = []
    const callResultsInterfaces = []
    const contractMethods = []
    const txResultsConverters = []
    for (let i = 0; i < dealAddresses.length; i++) {
      const dealAddress = dealAddresses[i]
      if (!dealAddress) {
        throw new Error('Assertion: dealAddress is undefined.')
      }
      callsEncoded.push({
        target: dealAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: callEncoded,
      })
      callResultsInterfaces.push(contractInstance.interface)
      contractMethods.push(contractMethod)
      txResultsConverters.push(serializeTxDealStatus)
    }

    return await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    )
  }

  async getFreeBalanceDealBatch(dealAddresses: Array<string>) {
    if (dealAddresses[0] == undefined) {
      return []
    }

    const contractInstance = Deal__factory.connect(
      dealAddresses[0],
      this._caller,
    )
    const contractMethod = 'getFreeBalance'
    const callEncoded =
      contractInstance.interface.encodeFunctionData(contractMethod)

    const callsEncoded: Multicall3ContractCall[] = []
    const callResultsInterfaces = []
    const contractMethods = []
    const txResultsConverters = []
    for (let i = 0; i < dealAddresses.length; i++) {
      const dealAddress = dealAddresses[i]
      if (!dealAddress) {
        throw new Error('Assertion: dealAddress is undefined.')
      }
      callsEncoded.push({
        target: dealAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: callEncoded,
      })
      callResultsInterfaces.push(contractInstance.interface)
      contractMethods.push(contractMethod)
      txResultsConverters.push(serializeTxToBigInt)
    }

    // TODO: add exact validation instead of "as".
    return (await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    )) as Array<bigint | null>
  }

  // Get statuses for batch of Capacity Commitments by 1 call.
  async getStatusCapacityCommitmentsBatch(
    capacityContractAddress: string,
    capacityCommitmentIds: Array<string>,
  ) {
    // We need any of the deal contract coz we will use interface of the Deal only.
    const contractInstance = Capacity__factory.connect(
      capacityContractAddress,
      this._caller,
    )
    const contractMethod = 'getStatus'
    const callsEncoded: Multicall3ContractCall[] = []
    const callResultsInterfaces = []
    const contractMethods = []
    const txResultsConverters = []
    for (let i = 0; i < capacityCommitmentIds.length; i++) {
      callsEncoded.push({
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData(
          contractMethod,
          [capacityCommitmentIds[i]],
        ),
      })
      callResultsInterfaces.push(contractInstance.interface)
      contractMethods.push(contractMethod)
      txResultsConverters.push(serializeTxCapacityCommitmentStatus)
    }

    // TODO: add exact validation instead of "as".
    return (await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    )) as Array<CapacityCommitmentStatus>
  }

  // Fetch on-chain data through several view methods of Capacity contract for the exact CC.
  // It gets:
  // - status
  // - unlockedRewards
  // - totalRewards
  async getCapacityCommitmentDetails(
    capacityContractAddress: string,
    capacityCommitmentId: string,
  ) {
    const contractInstance = Capacity__factory.connect(
      capacityContractAddress,
      this._caller,
    )

    const contractMethods = ['getStatus', 'unlockedRewards', 'totalRewards']
    const txResultsConverters = [
      serializeTxCapacityCommitmentStatus,
      serializeTxToBigInt,
      serializeTxToBigInt,
    ]
    const callsEncoded: Multicall3ContractCall[] = [
      {
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData('getStatus', [
          capacityCommitmentId,
        ]),
      },
      {
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData(
          'unlockedRewards',
          [capacityCommitmentId],
        ),
      },
      {
        target: capacityContractAddress,
        allowFailure: true, // We allow failure for all calls.
        callData: contractInstance.interface.encodeFunctionData(
          'totalRewards',
          [capacityCommitmentId],
        ),
      },
    ]
    const callResultsInterfaces = [
      contractInstance.interface,
      contractInstance.interface,
      contractInstance.interface,
    ]

    const results = await this._callBatch(
      callsEncoded,
      callResultsInterfaces,
      contractMethods,
      txResultsConverters,
    )
    if (results.length != 3) {
      throw new Error(
        '[getCapacityCommitmentDetails] Assertion: results.length != 3',
      )
    }
    return {
      status: results[0] as CapacityCommitmentStatus,
      unlockedRewards: results[1] as bigint | null,
      totalRewards: results[2] as bigint | null,
    }
  }
}
