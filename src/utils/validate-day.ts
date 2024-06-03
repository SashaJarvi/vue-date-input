const validateDay = (day: string, maxDays: number): string => {
  if (parseInt(day, 10) > maxDays) {
    return maxDays.toString()
  }

  return day
}

export default validateDay
