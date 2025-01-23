import React from 'react'
import styled from '@emotion/styled'
import { OfferResource } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/indexerClient/generated.types'

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
import { TokenBadge } from '../../components/TokenBadge'
import { Tooltip } from '../../components/Tooltip'
import { JsonToYamlView } from '../../components/YamlView'
import {
  formatFullUSDcTokenValue,
  formatRoundedUSDcTokenValue,
} from '../../utils'
import { getResourceName } from '../../utils/getResourceName'
import { formatHexData } from '../../utils/helpers'

const TextWithBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

interface ResourceTableProps {
  resources: Omit<OfferResource, 'offer'>[]
}

export const OfferResourceTable: React.FC<ResourceTableProps> = ({
  resources,
}) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Resource ID</TableColumnTitle>
          <TableColumnTitle>Type</TableColumnTitle>
          <TableColumnTitle>Price</TableColumnTitle>
          <TableColumnTitle>Metadata</TableColumnTitle>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <ResourceRow key={resource.id} offerResource={resource} />
          ))}
        </TableBody>
      </ScrollableTable>
    </>
  )
}

interface OfferResourceRowProps {
  offerResource: Omit<OfferResource, 'offer'>
}

const ResourceRow: React.FC<OfferResourceRowProps> = ({
  offerResource: { id, resourceDescription, price },
}: OfferResourceRowProps) => {
  const resourceName = getResourceName(resourceDescription.type)

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
              <TextWithBadge>
                <Tooltip
                  trigger={
                    <Text size={12}>
                      {formatRoundedUSDcTokenValue(BigInt(price))}
                    </Text>
                  }
                >
                  <Text color="grey600" weight={600} size={12}>
                    {formatFullUSDcTokenValue(BigInt(price))}
                  </Text>
                </Tooltip>
                <TokenBadge bg="grey200">
                  <Text size={10} weight={800} color="grey500">
                    USDC
                  </Text>
                </TokenBadge>
              </TextWithBadge>
            </Cell>
            <Cell>
              <Text size={12}>
                <JsonToYamlView data={resourceDescription.metadata} />
              </Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
