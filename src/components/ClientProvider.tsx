import React from 'react'
import { createContext, FC, ReactNode } from 'react'
import { StakerClient } from '@fluencelabs/deal-ts-clients'

import { useStakerClient } from '../hooks'

export const ClientContext = createContext<StakerClient | undefined>(undefined)

export const ClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const client = useStakerClient()

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  )
}
