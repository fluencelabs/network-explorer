import {
  type IMulticall3,
  IMulticall3__factory,
} from '@fluencelabs/deal-aurora'
import type { ethers, Interface, Result } from 'ethers'

export type Multicall3ContractCall = {
  target: string
  allowFailure: boolean
  callData: string
}
export type Aggregate3Response = { success: boolean; returnData: string }
// TODO: fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TxResultsConverter = (result: Result | null, ...opt: any[]) => any

/*
 * @description Client to be inherited from to work with Multicall3 contract to perform batch calls.
 * @dev For more info: https://github.com/mds1/multicall/tree/main.
 */
export abstract class Multicall3ContractClientABC {
  _caller: ethers.Provider | ethers.Signer
  _multicall3Contract: IMulticall3
  constructor(
    caller: ethers.Provider | ethers.Signer,
    multicall3ContractAddress: string,
  ) {
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
  async _callBatch(
    callsEncoded: Multicall3ContractCall[],
    callResultsInterfaces: Array<Interface>,
    contractMethods: Array<string>,
    txResultsConverters: Array<TxResultsConverter>,
    // TODO: fix
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Array<any>> {
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
    console.log(
      `[_callBatch] Send batch request with callsEncoded = ${JSON.stringify(
        callsEncoded,
      )}...`,
    )
    const multicallContractCallResults: Aggregate3Response[] =
      await this._multicall3Contract.aggregate3.staticCall(callsEncoded)
    console.log(
      `[_callBatch] Got: ${JSON.stringify(multicallContractCallResults)}`,
    )

    // TODO: fix
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedResults: Array<any> = []
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
      console.log(`[_callBatch] Raw data: ${rawReturnData}`)

      const decoded = callResultsInterface.decodeFunctionResult(
        contractMethod,
        rawReturnData,
      )
      console.log(`[_callBatch] Got after decoding: ${decoded}`)
      console.log(`[_callBatch] Apply converter: ${txResultsConverter.name}`)
      decodedResults.push(txResultsConverter(decoded))
    }
    return decodedResults
  }

  // Basic implementation of TxResultsConverter.
  _decodeToString(result: Result | null, defaultNoResult: string = ''): string {
    if (!result) {
      return defaultNoResult
    }
    return result.toString()
  }
}
