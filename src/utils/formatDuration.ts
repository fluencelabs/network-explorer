import { formatDistanceStrict } from 'date-fns'

export function formatDuration(duration: number) {
  return formatDistanceStrict(Date.now() + duration, Date.now(), {
    unit: duration > 60 * 60 * 24 * 1000 ? 'day' : undefined,
  })
}
