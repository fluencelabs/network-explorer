const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const formatUnixTimestamp = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000)

  const day = date.getUTCDate()
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const seconds = date.getUTCSeconds().toString().padStart(2, '0')

  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12 // Convert 24h to 12h format

  return {
    date: `${day} ${month} ${year}`,
    time: `${formattedHours}:${minutes}:${seconds} ${ampm} +UTC`,
  }
}
