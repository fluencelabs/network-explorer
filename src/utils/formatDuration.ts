import { formatDistanceStrict } from 'date-fns'

export function formatDuration(duration: number) {
  return formatDistanceStrict(duration, 0, {
    unit: duration > 60 * 60 * 24 * 1000 ? 'day' : undefined,
  })
}
