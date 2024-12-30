import React from 'react'
import yaml from 'js-yaml'

import { ErrorBoundary } from './ErrorBoundary'

const JsonToYamlViewBase = ({ data }: { data: string }) => {
  const yamlString = data === '{}' ? '' : yaml.dump(JSON.parse(data))

  return <pre>{yamlString}</pre>
}

export const JsonToYamlView = ({ data }: { data: string }) => {
  return (
    <ErrorBoundary fallback={<pre>{data}</pre>}>
      <JsonToYamlViewBase data={data} />
    </ErrorBoundary>
  )
}
