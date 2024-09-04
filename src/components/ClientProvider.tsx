import React from 'react'
import { createContext, FC, ReactNode } from 'react'
import { DealExplorerClient } from '@fluencelabs/deal-ts-clients'

import { useClient } from '../hooks'

export const ClientContext = createContext<DealExplorerClient | undefined>(
  undefined,
)

export const ClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const client = useClient()

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  )
}
