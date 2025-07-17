import type { Transactions } from "../types/types"

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

export const formatCategory = (cat: string) => {
	return cat.split('_').join(' ')
}

export const isDateInCurrentMonth = (date: Date) => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

export const calculateTotalSpending = (transactions: Transactions[]) => {
  return transactions.reduce((sum, tx) => {
    if (isDateInCurrentMonth(new Date(tx.authorized_date)) && tx.amount > 0) {
      return sum + tx.amount
    }

    return sum
  }, 0)
}

export const calculateSpendingData = (transactions: Transactions[]) => {
  const cumulativeData = []
  const filterTransactions = transactions.filter((tx) => isDateInCurrentMonth(new Date(tx.authorized_date)) && tx.amount > 0)
  let runningTotal = 0
  for (const tx of filterTransactions) {
    runningTotal += tx.amount
    cumulativeData.push({
      date: new Date(tx.authorized_date),
      total: runningTotal
    })
  }

  return cumulativeData
}