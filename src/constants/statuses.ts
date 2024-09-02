import { CapacityCommitmentStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { Colors } from './colors'

export type StatusColor = Extract<
  Colors,
  'green' | 'red' | 'blue' | 'grey300' | 'grey200'
>

export const STATUS_COLORS: {
  [status in CapacityCommitmentStatus]: StatusColor
} = {
  undefined: 'red',
  waitDelegation: 'grey300',
  waitStart: 'grey300',
  active: 'green',
  inactive: 'grey300',
  failed: 'grey300',
  removed: 'grey300',
}
