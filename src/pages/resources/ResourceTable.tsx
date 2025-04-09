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
import { useApiQuery } from '../../hooks'
import { getResourceName } from '../../utils/getResourceName'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(200px, 1fr)',
]

export const ResourceTable: React.FC = () => {
  const { data, isLoading } = useApiQuery(`resources`, (client) =>
    client.getResources(),
  )

  return (
    <ScrollableTable>
      <TableHeader template={template}>
        <TableColumnTitle>Resource ID</TableColumnTitle>
        <TableColumnTitle>Type</TableColumnTitle>
        <TableColumnTitle>Metadata</TableColumnTitle>
      </TableHeader>
      <TableBody skeletonHeight={48} isLoading={isLoading}>
        {data?.data?.map((resource) => (
          <ResourceRow key={resource.id} resource={resource} />
        ))}
      </TableBody>
    </ScrollableTable>
  )
}

interface ResourceRowProps {
  resource: {
    id: string
    metadata?: string
    type: number
  }
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resource: { id, type, metadata },
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
