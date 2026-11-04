// Date range helpers for the charts. Date inputs work in local days; the API gets exact times,
// so an end date covers its whole day.
const DAY_MS = 24 * 60 * 60 * 1000

export const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

// 'YYYY-MM-DD' from a date input, as a local date
export const fromInput = (value) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const toInput = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Default range: midnight 30 days ago to the end of today. Call these when a page opens.
export const defaultStartDate = () => startOfDay(new Date(Date.now() - 30 * DAY_MS))
export const defaultEndDate = () => endOfDay(new Date())
