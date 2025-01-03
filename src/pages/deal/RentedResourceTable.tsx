import React from 'react'

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

import { ResourceType, ResourceTypeNames } from '../offer/ResourceTable'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(200px, 1fr)',
]

interface ResourceTableProps {
  resources?:
    | {
        id: string
        details?: string
        quantity: string
        metadata?: string
        type: number
      }[]
    | null
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Resource ID</TableColumnTitle>
          <TableColumnTitle>Type</TableColumnTitle>
          <TableColumnTitle>Rented</TableColumnTitle>
          <TableColumnTitle>Metadata</TableColumnTitle>
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
    details?: string
    quantity: string
    metadata?: string
    type: number
  }
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resource: { id, details, type, metadata, quantity },
}: ResourceRowProps) => {
  const resourceName = Object.values(ResourceType).includes(type)
    ? ResourceTypeNames[type as ResourceType]
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
            <Text size={12}>{quantity}</Text>
          </Cell>
          <Cell>
            <Text size={12}>
              <JsonToYamlView data={metadata ?? '{}'} />
            </Text>
          </Cell>
          <Cell>
            <Text size={12}>
              <JsonToYamlView data={details ?? '{}'} />
            </Text>
          </Cell>
        </Row>
      </RowTrigger>
    </RowHeader>
  )
}
