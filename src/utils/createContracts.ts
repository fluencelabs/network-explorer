import { Contracts } from '@fluencelabs/deal-ts-clients'
import { JsonRpcProvider } from 'ethers'

import { DEPLOYMENT, RPC_URL } from '../constants/config'

let contracts: Contracts

export function createContracts() {
  if (contracts === undefined) {
    contracts = new Contracts(new JsonRpcProvider(RPC_URL), DEPLOYMENT)
  }

  return contracts
}
