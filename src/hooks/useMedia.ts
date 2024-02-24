import { useWindowSize } from './useWindowSize'

type MediaBreakpoints = Record<BreakPointTypes, boolean>
interface IMedia extends MediaBreakpoints {
  currentMedia: BreakPointTypes
}

export type BreakPointTypes = 'desktop' | 'tablet' | 'mobile'

export type Breakpoints = Record<BreakPointTypes, number>

export const breakpoints: Breakpoints = {
  desktop: 1200,
  tablet: 992,
  mobile: 576,
}

export const media: Record<BreakPointTypes, string> = {
  desktop: `@media (min-width: ${breakpoints.tablet}px)`,
  tablet: `@media (min-width: ${breakpoints.mobile + 1}px) and (max-width: ${
    breakpoints.tablet
  }px)`,
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
}

export const useMedia = (): IMedia => {
  const { width } = useWindowSize()
  const media: MediaBreakpoints = {
    mobile: width <= breakpoints.mobile,
    tablet: width > breakpoints.mobile && width <= breakpoints.tablet,
    desktop: width > breakpoints.tablet,
  }

  const currentMedia = Object.keys(media).filter(
    (key) => media[key as BreakPointTypes],
  ) as BreakPointTypes[]

  return {
    ...media,
    currentMedia: currentMedia[0],
  }
}
