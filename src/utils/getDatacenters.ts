import { DEPLOYMENTS } from '@fluencelabs/deal-ts-clients'
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider('https://rpc.testnet.fluence.dev')

export const fetchAndDecodeEvents = async () => {
  try {
    const contractABI = [
      'event DatacenterCreated(bytes32 indexed id, string countryCode, string cityCode, uint256 index, uint256 tier, string[] certifications)',
    ]

    const contract = new ethers.Contract(
      DEPLOYMENTS.testnet.diamond,
      contractABI,
      provider,
    )

    const filter = contract.filters.DatacenterCreated()

    const logs = await contract.queryFilter(filter, 0, 'latest')

    return {
      data: logs.map(
        ({
          args: { id, countryCode, cityCode, index, tier, certifications },
        }) => ({
          id: id,
          countryCode,
          cityCode,
          index: index.toString(),
          tier: tier.toString(),
          certifications,
        }),
      ),
      total: logs.length,
    }
  } catch (error) {
    console.error('Error fetching or decoding events:', error)
  }
}
