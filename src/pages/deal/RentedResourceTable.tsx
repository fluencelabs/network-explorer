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
import { getResourceName } from '../../utils/getResourceName'
import { formatHexData } from '../../utils/helpers'

import { DealWorkerToResourceFragment } from '../../../generated/graphql'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(200px, 1fr)',
]

interface ResourceTableProps {
  resources?: DealWorkerToResourceFragment[]
}

export const RentedResourceTable: React.FC<ResourceTableProps> = ({
  resources,
}) => {
  return (
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
          <ResourceRow
            key={resource.peerResource.resourceDescription.id}
            resource={resource}
          />
        ))}
      </TableBody>
    </ScrollableTable>
  )
}

interface ResourceRowProps {
  resource: DealWorkerToResourceFragment
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resource: {
    resourceRequirements: { quantity },
    peerResource: {
      details,
      resourceDescription: { type, metadata, id },
    },
  },
}: ResourceRowProps) => {
  const resourceName = getResourceName(type)

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
