import React from 'react'
import styled from '@emotion/styled'

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
`

const Key = styled.span`
  color: #0366d6;
  font-weight: bold;
`

const String = styled.span`
  color: #032f62;
`

const Number = styled.span`
  color: #005cc5;
`

const Boolean = styled.span`
  color: #d73a49;
`

const Null = styled.span`
  color: #6a737d;
  font-style: italic;
`

const Loading = styled.div`
  text-align: center;
  color: #0366d6;
  font-size: 16px;
  font-weight: bold;
  padding: 20px;
`

const PrettyJsonView = ({
  json,
  isLoading,
}: {
  json: unknown
  isLoading?: boolean
}) => {
  const renderJson = (data: unknown) => {
    if (typeof data === 'string') {
      return <String>&quot;{data}&quot;</String>
    }
    if (typeof data === 'number') {
      return <Number>{data}</Number>
    }
    if (typeof data === 'boolean') {
      return <Boolean>{data.toString()}</Boolean>
    }
    if (data === null) {
      return <Null>null</Null>
    }
    if (Array.isArray(data)) {
      return (
        <>
          {'['}
          <br />
          {data.map((item, index) => (
            <div key={index} style={{ marginLeft: '20px' }}>
              {renderJson(item)}
              {index < data.length - 1 && ','}
            </div>
          ))}
          {']'}
        </>
      )
    }
    if (typeof data === 'object') {
      return (
        <>
          {'{'}
          <br />
          {Object.keys(data).map((key, index, array) => (
            <div key={key} style={{ marginLeft: '20px' }}>
              <Key>&quot;{key}&quot;</Key>:{' '}
              {renderJson((data as { [key: string]: unknown })[key])}
              {index < array.length - 1 && ','}
            </div>
          ))}
          {'}'}
        </>
      )
    }
  }

  return (
    <Container>
      {isLoading ? <Loading>Loading...</Loading> : renderJson(json)}
    </Container>
  )
}

export function ConfigJson() {
  const { data, isLoading } = useApiQuery((client) =>
    client.getNetworkConstants(),
  )

  return <PrettyJsonView isLoading={isLoading} json={data} />
}
