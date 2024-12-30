import React from 'react'
import { Peer } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import {
  Cell,
  Row,
  RowHeader,
  RowTrigger,
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableHeader,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { JsonToYamlView } from '../../components/YamlView'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(200px, 1fr)',
]

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

interface ResourceTableProps {
  resources: Peer['resources']
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Resource ID</TableColumnTitle>
          <TableColumnTitle>Type</TableColumnTitle>
          <TableColumnTitle>Total</TableColumnTitle>
          <TableColumnTitle>Available</TableColumnTitle>
          <TableColumnTitle>Metadata</TableColumnTitle>
        </TableHeader>
        <TableBody>
          {resources?.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
        </TableBody>
      </ScrollableTable>
    </>
  )
}

interface ResourceRowProps {
  resource: {
    id: string
    maxSupply: number
    availableSupply: number
    details: string
    resource?: {
      metadata: string
      type: number
      id: string
    }
  }
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resource: { id, details, availableSupply, maxSupply, resource },
}: ResourceRowProps) => {
  const resourceName =
    resource && Object.values(ResourceType).includes(resource.type)
      ? ResourceTypeNames[resource.type as ResourceType]
      : 'Unknown'

  return (
    <RowHeader>
      <RowTrigger>
        <Row template={template}>
          <Cell>
            <Text size={12}>{formatHexData(id, 8, 10)}</Text>
          </Cell>
          <Cell>
            <Text size={12}>{resourceName}</Text>
          </Cell>
          <Cell>
            <Text size={12}>{availableSupply}</Text>
          </Cell>
          <Cell>
            <Text size={12}>{maxSupply}</Text>
          </Cell>
          <Cell>
            <Text size={12}>
              <JsonToYamlView data={details} />
            </Text>
          </Cell>
        </Row>
      </RowTrigger>
    </RowHeader>
  )
}
