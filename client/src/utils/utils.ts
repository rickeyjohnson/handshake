export const capitalize = (name: string | null) => {
    if (!name) { return ''}
    return name.charAt(0).toUpperCase() + name.slice(1)
}

export const formatMoney = (amount: number, round: boolean = false) => {
  const value = round ? Math.round(amount) : amount;

  const formatted = Math.abs(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: round ? 0 : 2,
    maximumFractionDigits: round ? 0 : 2,
  });

  return value < 0 ? `-${formatted}` : formatted;
}