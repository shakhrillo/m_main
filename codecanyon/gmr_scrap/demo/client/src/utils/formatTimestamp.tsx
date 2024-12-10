export const formatTimestamp = (date: string) => {
  if (!date) return ""

  const d = new Date(date) // Convert the string to a Date object
  if (isNaN(d.getTime())) return "" // Check if the date is valid

  // Format the date (e.g., "YYYY-MM-DD HH:mm:ss")
  const formattedDate = d.toISOString().replace("T", " ").split(".")[0]
  return formattedDate
}
