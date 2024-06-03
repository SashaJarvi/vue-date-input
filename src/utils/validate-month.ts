const validateMonth = (month: string): string => {
  if (parseInt(month, 10) > 12) {
    return '12'
  }

  return month
}

export default validateMonth
