import React from 'react'
import styled from '@emotion/styled'

import { Copyable } from '../../components/Copyable'
import { useApiQuery } from '../../hooks'

const Container = styled.div`
  background-color: #f6f8fa;
  padding: 15px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #24292e;
  overflow-x: auto;
  max-width: 100%;
  word-wrap: break-word;
  position: relative;
`

const StyledCopy = styled(Copyable)`
  position: absolute;
  scale: 1.4;
  right: 10px;
  top: 10px;
`

const CodeBlock = styled.code`
  display: block;
  white-space: pre-wrap;
`

// Loading message or spinner
const Loading = styled.div`
  text-align: center;
  color: #0366d6;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
`

const replacer = (_: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() + 'n' : value
}

const PrettyJsonView = ({
  json,
  isLoading,
}: {
  json: unknown
  isLoading?: boolean
}) => {
  const renderJsonString = (data: unknown) => {
    return JSON.stringify(data, replacer, 2)
  }

  const rendered = renderJsonString(json)

  return (
    <Container>
      <StyledCopy value={rendered} />
      {isLoading ? (
        <Loading>Loading...</Loading>
      ) : (
        <CodeBlock>{rendered}</CodeBlock>
      )}
    </Container>
  )
}

export function ConfigJson() {
  const { data, isLoading } = useApiQuery((client) =>
    client.getNetworkConstants(),
  )

  return <PrettyJsonView isLoading={isLoading} json={data} />
}
