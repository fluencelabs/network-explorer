import { Datacenter } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/indexerClient/generated.types'

export function getDatacenterCode({
  countryCode,
  cityCode,
  cityIndex,
}: Pick<Datacenter, 'countryCode' | 'cityCode' | 'cityIndex'>) {
  return `${countryCode}-${cityCode}-${cityIndex}`
}
