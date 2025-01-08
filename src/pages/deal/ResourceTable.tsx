import React from 'react'

import {
  Cell,
  Row,
  RowBlock,
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
          <TableColumnTitle>Requested</TableColumnTitle>
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
    details?: string
    quantity: string
    metadata?: string
    type: number
  }
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resource: { id, type, metadata, quantity },
}: ResourceRowProps) => {
  const resourceName = getResourceName(type)

  return (
    <RowBlock>
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
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
