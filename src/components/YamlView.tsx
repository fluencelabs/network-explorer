import React from 'react'
import yaml from 'js-yaml'

import { isValidJSON } from '../utils/isValidJson'

import { ErrorBoundary } from './ErrorBoundary'

const JsonToYamlViewBase = ({ data }: { data: string }) => {
  const yamlString =
    data === '{}' ? '' : isValidJSON(data) ? yaml.dump(JSON.parse(data)) : data

  return <pre>{yamlString}</pre>
}

export const JsonToYamlView = ({ data }: { data: string }) => {
  return (
    <ErrorBoundary fallback={<pre>{data}</pre>}>
      <JsonToYamlViewBase data={data} />
    </ErrorBoundary>
  )
}
