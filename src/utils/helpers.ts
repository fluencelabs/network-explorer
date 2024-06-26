import React from 'react'
import { Effector } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

export const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}

export const formatHexData = (data: string, left = 6, right = 8) => {
  if (data.length <= left + right + 2) {
    return data
  }
  const prefix = data.slice(0, left)
  const suffix = data.slice(-right)
  return `${prefix}...${suffix}`
}

export const formatEffectors = (effectors: Effector[]) => {
  let known = 0
  let unknown = 0
  const knownNames: string[] = []
  for (const effector of effectors) {
    if (effector.description === 'Unknown') {
      unknown += 1
    } else {
      known += 1
      if (knownNames.length < 2) {
        knownNames.push(effector.description)
      }
    }
  }
  if (known > 0) {
    return (
      knownNames.join(', ') +
      (unknown > 0 ? ` + ${effectors.length - knownNames.length} more` : '')
    )
  } else {
    const label = effectors.length === 1 ? 'effector' : 'effectors'
    return `${effectors.length} ${label}`
  }
}
