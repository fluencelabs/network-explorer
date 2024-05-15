export const formatUnixTimestamp = (unixTimestamp: number) => {
  return {
    date: new Date(unixTimestamp * 1000).toLocaleDateString(),
    time: new Date(unixTimestamp * 1000).toLocaleTimeString(),
  }
}
