export const capitalize = (name: string | null) => {
    if (!name) { return ''}
    name = name.toLowerCase()
    return name.charAt(0).toUpperCase() + name.slice(1)
}

export const formatCurrency = (amount: number, round: boolean = false) => {
  const value = round ? Math.round(amount) : amount;

  const formatted = Math.abs(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: round ? 0 : 2,
    maximumFractionDigits: round ? 0 : 2,
  });

  return value < 0 ? `-${formatted}` : formatted;
}

export const numify = (str: string) => {
  const value = str.split('$').join('')
  const parts = value.split('.')
  let sanitized = parts[0]
  if (parts.length > 1) {
    sanitized += '.' + parts[1].slice(0, 2)
  }

  console.log(Number(sanitized))
  return Number(sanitized)
}