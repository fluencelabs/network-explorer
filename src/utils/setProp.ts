import { CSSProperties } from 'react'

export const setProp = <
  T extends CSSProperties,
  Prop extends keyof CSSProperties,
>(
  prop: Prop,
  cssProp: string,
  defaultValue?: CSSProperties[Prop],
) => {
  return (props: T) => {
    const isPropExist = prop in props

    if (defaultValue && !isPropExist) return `${cssProp}: ${defaultValue};`

    return isPropExist && `${cssProp}: ${props[prop]};`
  }
}
