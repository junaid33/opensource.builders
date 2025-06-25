import { parse, isValid, formatISO, format } from "date-fns"

const FULL_TIME_PATTERN = "HH:mm:ss.SSS"

function formatFullTime(date: Date): string {
  return format(date, FULL_TIME_PATTERN)
}

export function formatTime(time: string): string {
  const date = parse(time, FULL_TIME_PATTERN, new Date())
  if (date.getMilliseconds() !== 0) {
    return format(date, FULL_TIME_PATTERN)
  }
  if (date.getSeconds() !== 0) {
    return format(date, "HH:mm:ss")
  }
  return format(date, "HH:mm")
}

export function parseTime(time: string): string | undefined {
  for (const pattern of ["H:m:s.SSS", "H:m:s", "H:m", "H"]) {
    const parsed = parse(time, pattern, new Date())
    if (isValid(parsed)) {
      return format(parsed, FULL_TIME_PATTERN)
    }
  }
  return undefined
}

export function constructTimestamp({ dateValue, timeValue }: { dateValue: string, timeValue: string }): string {
  return new Date(`${dateValue}T${timeValue}`).toISOString()
}

export function deconstructTimestamp(value: string) {
  return {
    dateValue: formatISO(new Date(value), { representation: "date" }),
    timeValue: { kind: "parsed" as const, value: formatFullTime(new Date(value)) }
  }
}

export function formatOutput(value: string | null): string {
  if (!value) return ""
  const date = new Date(value)
  return date.toLocaleString()
} 