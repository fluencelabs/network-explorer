export enum ResourceType {
  PHYSICAL_CORE,
  RAM,
  STORAGE,
  PUBLIC_IP,
  NETWORK_BANDWIDTH,
  GPU,
}

export const ResourceTypeNames = {
  [ResourceType.PHYSICAL_CORE]: 'vCPU',
  [ResourceType.RAM]: 'RAM',
  [ResourceType.STORAGE]: 'STORAGE',
  [ResourceType.PUBLIC_IP]: 'IP',
  [ResourceType.NETWORK_BANDWIDTH]: 'BANDWIDTH',
  [ResourceType.GPU]: 'GPU',
} as const

export function getResourceName(type: number) {
  return Object.values(ResourceType).includes(type)
    ? ResourceTypeNames[type as ResourceType]
    : 'Unknown'
}
