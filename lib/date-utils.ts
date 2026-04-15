export function getEgyptDate(): string {
  // Egypt timezone is Africa/Cairo (UTC+2 in winter, UTC+3 in summer DST)
  const now = new Date()

  // Create formatter for Egypt timezone
  const egyptFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const parts = egyptFormatter.formatToParts(now)
  const year = parts.find((p) => p.type === "year")?.value
  const month = parts.find((p) => p.type === "month")?.value
  const day = parts.find((p) => p.type === "day")?.value

  return `${year}-${month}-${day}`
}

export function formatEgyptDate(date: Date | any): string {
  const d = (date as any)?.toDate ? (date as any).toDate() : new Date(date as any)

  const formatter = new Intl.DateTimeFormat("en-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  return formatter.format(d)
}
