import { useState } from 'react'
import { OrderType } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'

export const useOrder = <
  OrderBy extends string,
  Order extends string = `${OrderBy}:${OrderType}`,
>(
  defaultOrder: Order,
) => {
  const [order, setOrder] = useState<Order>(defaultOrder)
  const [orderBy, orderType] = order.split(':') as [OrderBy, OrderType]

  const handleSort = (key: OrderBy, order: OrderType) => {
    setOrder(`${key}:${order}` as Order)
  }

  return {
    orderBy,
    orderType,
    handleSort,
  }
}
