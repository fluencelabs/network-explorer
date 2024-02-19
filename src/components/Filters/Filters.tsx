import React from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Dialog from '@radix-ui/react-dialog'

import { FiltersIcon } from '../../assets/icons'

import { colors } from '../../constants/colors'
import { Button } from '../Button'

interface FiltersProps {
  children: React.ReactNode | React.ReactNode[]
  selectedCount?: number
}

export const Filters: React.FC<FiltersProps> = ({
  children,
  selectedCount,
}) => {
  const rightIcon = selectedCount ? (
    <FiltersCountIcon>{selectedCount}</FiltersCountIcon>
  ) : null

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          leftIcon={<FiltersIcon />}
          rightIcon={rightIcon}
        >
          Filters
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <ModalContainer>{children}</ModalContainer>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const FiltersCountIcon = styled.div`
  background-color: ${colors.grey200};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 12px;
  font-weight: 600;
`

const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`

const ModalContainer = styled(Dialog.Content)`
  background-color: white;
  border-radius: 12px;
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 350px;
  max-height: 85vh;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 9999;
`
