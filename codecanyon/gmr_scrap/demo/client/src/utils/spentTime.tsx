export const spentTime = (placeInfo: any): string => {
  if (!placeInfo?.createdAt || !placeInfo?.updatedAt) {
    return "N/A"
  }

  const startMilliseconds = Number(placeInfo.createdAt)
  const endMilliseconds = Number(placeInfo.updatedAt || Date.now())

  // Ensure both values are valid numbers
  if (isNaN(startMilliseconds) || isNaN(endMilliseconds)) {
    return "Invalid timestamps"
  }

  const diffInSeconds = Math.floor((endMilliseconds - startMilliseconds) / 1000)

  if (diffInSeconds < 0) {
    return "Invalid time range"
  }

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  return `${Math.floor(diffInSeconds / 3600)}h`
}
