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
import { getResourceName } from '../../utils/getResourceName'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(200px, 1fr)',
]

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
          <TableColumnTitle>Details</TableColumnTitle>
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
  const resourceName = resource && getResourceName(resource.type)

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
