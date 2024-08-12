import React from 'react'
import { ClipLoader } from 'react-spinners'
import styled from '@emotion/styled'
import { ContractsENV } from '@fluencelabs/deal-ts-clients'
import * as RadixSelect from '@radix-ui/react-select'

import { DocsIcon } from '../assets/icons'
import { MainnetIcon, TestnetIcon } from '../assets/icons'
import { ArrowIcon } from '../assets/icons'
import { useCurrentEpoch } from '../hooks/useCurrentEpoch'

import { colors } from '../constants/colors'
import {
  CHAIN_ID,
  FLUENCE_CLIENT_NETWORK,
  GELATO_MAINNET_NETWORK_ID,
} from '../constants/config'

import { Button } from './Button'
import { Select, SelectItem } from './Select'
import { Text } from './Text'

const items: SelectItem<ContractsENV>[] = [
  {
    label: 'Stage',
    value: 'stage',
    icon: <TestnetIcon />,
  },
  {
    label: 'Dar',
    value: 'dar',
    icon: <TestnetIcon />,
  },
  {
    label: 'Kras',
    value: 'kras',
    icon: <MainnetIcon />,
  },
  {
    label: 'New',
    value: 'mainnet',
    icon: <MainnetIcon />,
  },
]

// TODO: if no key in dict choose default instead of this hardcode.
if (FLUENCE_CLIENT_NETWORK === 'local') {
  items.push({
    label: 'Local',
    value: 'local',
    icon: <TestnetIcon />,
  })
}

const explorerUrls: Record<string, string> = {
  stage: 'https://explorer.stage.fluence.dev',
  dar: 'https://explorer.dar.fluence.dev',
  kras: 'https://explorer.kras.fluence.dev',
  mainnet: 'https://explorer.new.fluence.dev',
}

export const RightMenu: React.FC = () => {
  const curEpoch = useCurrentEpoch()

  return (
    <RightMenuBlock>
      <LinksBlock>
        <StyledA href="https://fluence.dev/docs/learn/overview" target="_blank">
          <DocsIcon />
          <Text size={14}>Docs</Text>
        </StyledA>
      </LinksBlock>
      <Select
        // TODO: remove the 'CHAIN_ID == GELATO_MAINNET_NETWORK_ID' condition once old Kras is deprecated
        value={
          CHAIN_ID == GELATO_MAINNET_NETWORK_ID
            ? 'mainnet'
            : FLUENCE_CLIENT_NETWORK
        }
        onChange={(value) => window.open(explorerUrls[value], '_self')}
        items={items}
      >
        {(item) => {
          // TODO warning <button> cannot appear as a descendant of <button>
          return (
            <StyledButton variant="outline" leftIcon={item.icon}>
              <RadixSelect.Value />
              <RadixSelect.Icon>
                <StyledArrowIcon />
              </RadixSelect.Icon>
            </StyledButton>
          )
        }}
      </Select>
      <LinksBlock>
        <StyledSpan>
          <Text size={14}>
            Epoch {curEpoch.data?.data && parseInt(curEpoch.data.data)}
            {!curEpoch.data?.data && (
              <ClipLoader color={colors.black900} loading={true} size={14} />
            )}
          </Text>
        </StyledSpan>
      </LinksBlock>
    </RightMenuBlock>
  )
}

const RightMenuBlock = styled.div`
  display: flex;
  gap: 24px;
`

const LinksBlock = styled.div`
  display: flex;
  gap: 16px;
`

const StyledA = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledSpan = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledButton = styled(Button)`
  width: 110px;
  justify-content: center;
  background: ${colors.white};
  border-radius: 6px;
  border: none;
  box-shadow:
    0px 1px 2px 0px #18181b0f,
    0px 1px 3px 0px #18181b1a;
`

const StyledArrowIcon = styled(ArrowIcon)`
  transform: rotate(90deg);
  margin-left: 3px;
  path {
    fill: ${colors.black900};
  }
`
