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
        details: string
        resource?: {
          metadata: string
          type: number
          id: string
        }
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
    details: string
    resource?: {
      metadata: string
      type: number
      id: string
    }
  }
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resource: { id, details, resource },
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
            <Text size={12}>
              <JsonToYamlView data={resource?.metadata ?? '{}'} />
            </Text>
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
