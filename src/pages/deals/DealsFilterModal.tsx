/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import styled from '@emotion/styled'
import { DealsFilters } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import * as Dialog from '@radix-ui/react-dialog'

import { CloseIcon, DatePickerIcon, ResetIcon } from '../../assets/icons'
import { Text } from '../../components/Text'

import { colors } from '../../constants/colors'

import 'react-datepicker/dist/react-datepicker.css'

interface DealsFilterModalProps {
  filters: DealsFilters
  setFilter: <T extends keyof DealsFilters>(
    key: T,
    filters: DealsFilters[T],
  ) => void
  resetFilters: () => void
}

export const DealsFilterModal: React.FC<DealsFilterModalProps> = ({
  filters,
  setFilter,
  resetFilters,
}) => {
  const {
    createdAtFrom,
    createdAtTo,
    minPricePerWorkerEpoch = '',
    maxPricePerWorkerEpoch = '',
  } = filters

  return (
    <ModalRoot>
      <ModalHeader>
        <Text size={20}>Filters</Text>
        <Dialog.Close>
          <CloseIconStyled />
        </Dialog.Close>
      </ModalHeader>
      <Divider />
      <ModalContent>
        {/* <CheckboxContainer>
          <Checkbox
            id="active-deals"
            label={
              <>
                <Text size={14}>Only active deals</Text>
                <Space width="3px" />
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text>Example</Text>
                </Tooltip>
              </>
            }
            checked={status === 'active'}
            onToggle={(checked) => {
              setFilter('status', checked ? 'active' : undefined)
            }}
          />
        </CheckboxContainer> */}
        <FromToContainer>
          <Text size={10} weight={700} uppercase color="grey400">
            Created At
          </Text>
          <FromToRow>
            <Text color="grey400" size={12}>
              from
            </Text>
            <DatePickerContainer>
              <DatePicker
                selected={
                  createdAtFrom
                    ? new Date(formatDate(createdAtFrom, true)!)
                    : undefined
                }
                placeholderText="from"
                onChange={(date) =>
                  setFilter('createdAtFrom', formatDate(date?.getTime()))
                }
                customInput={<DatePickerButton />}
                isClearable
              />
            </DatePickerContainer>
            <Text color="grey400" size={12}>
              to
            </Text>
            <DatePickerContainer>
              <DatePicker
                selected={
                  createdAtTo
                    ? new Date(formatDate(createdAtTo, true)!)
                    : undefined
                }
                placeholderText="to"
                onChange={(date) =>
                  setFilter('createdAtTo', formatDate(date?.getTime()))
                }
                customInput={<DatePickerButton />}
                isClearable
              />
            </DatePickerContainer>
          </FromToRow>
        </FromToContainer>
        <Divider />
        <FromToContainer>
          <Text size={10} weight={700} uppercase color="grey400">
            Price per epoch
          </Text>
          <FromToRow>
            <Text color="grey400" size={12}>
              from
            </Text>
            <NumberInput
              value={minPricePerWorkerEpoch}
              onChange={(e) =>
                setFilter(
                  'minPricePerWorkerEpoch',
                  !e.target.value ? undefined : Number(e.target.value),
                )
              }
              placeholder="0"
            />
            <Text color="grey400" size={12}>
              to
            </Text>
            <NumberInput
              value={maxPricePerWorkerEpoch}
              onChange={(e) =>
                setFilter(
                  'maxPricePerWorkerEpoch',
                  !e.target.value ? undefined : Number(e.target.value),
                )
              }
              placeholder="0"
            />
          </FromToRow>
        </FromToContainer>
        {/* <Divider />
        <EffectorsContainer>
          <Text size={10} weight={700} uppercase color="grey400">
            Effectors
          </Text>
          <Input placeholder="Curl, Ceramic, IPFS" />
        </EffectorsContainer>
        <EffectorsList>
          {effectors.map(({ cid, description }, index) => (
            <EffectorRow key={cid}>
              <Text size={12} color="black900">
                {index + 1}
              </Text>
              <ShrinkText size={12} color="blue">
                {cid}
              </ShrinkText>
              <ShrinkText size={12} color="blue">
                {description}
              </ShrinkText>
              <EffectorDeleteIcon />
            </EffectorRow>
          ))}
        </EffectorsList> */}
      </ModalContent>
      <Divider />
      <ModalFooter>
        <ResetContainer onClick={resetFilters}>
          <Text uppercase color="grey400" size={10} weight={700}>
            Reset All
          </Text>
          <ResetIconStyled />
        </ResetContainer>
      </ModalFooter>
    </ModalRoot>
  )
}

const DatePickerButton = forwardRef(
  ({ value, placeholder, onClick }: any, ref: any) => {
    return (
      <DateButton ref={ref} onClick={onClick}>
        <Text size={12} color="black900">
          {value || placeholder}
        </Text>
        <DatePickerIcon />
      </DateButton>
    )
  },
)

const formatDate = (date?: number, isToMilliseconds?: boolean) => {
  if (!date) return undefined

  if (isToMilliseconds) {
    return date * 1000
  }

  return date / 1000
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 48px;
`

const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  height: 40px;
`

const ResetContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`

const ResetIconStyled = styled(ResetIcon)`
  height: 16px;
  width: 16px;
`

const ModalRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10;
`

const Divider = styled.div`
  border: 1px solid #f4f4f5;
  width: 100%;
`

const FromToContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
`

const FromToRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

// const CheckboxContainer = styled.div`
//   padding: 16px 16px 24px;
// `

const CloseIconStyled = styled(CloseIcon)`
  cursor: pointer;
`

// const EffectorDeleteIcon = styled(CloseIconStyled)`
//   display: flex;
//   justify-self: flex-end;

//   path {
//     fill: ${colors.grey400};
//   }

//   &:hover {
//     path {
//       fill: ${colors.black900};
//     }
//   }
// `

// const EffectorsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
//   padding: 16px;
// `

// const EffectorsList = styled.div`
//   display: flex;
//   flex-direction: column;
//   padding: 16px;
// `

const Input = styled.input`
  border: 1px solid ${colors.grey200};
  border-radius: 4px;
  outline: none;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  height: 24px;

  &:placeholder {
    color: ${colors.grey400};
  }
`

const NumberInput = styled(Input)`
  padding: 6px 11px;
  width: 40px;
`

// const EffectorRow = styled.div`
//   display: grid;
//   grid-template-columns: 10px minmax(100px, 150px) minmax(100px, 150px) 1fr;
//   gap: 8px;
//   align-items: center;
//   padding: 8px 2px 8px 8px;
//   border-bottom: 1px solid ${colors.grey100};

//   &:last-child {
//     border: none;
//   }
// `

const DateButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  border: 1px solid ${colors.grey200};
  border-radius: 4px;
  padding: 0 8px;
  cursor: pointer;
`

const DatePickerContainer = styled.div`
  display: flex;
`
