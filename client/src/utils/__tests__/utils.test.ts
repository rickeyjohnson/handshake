import { formatCurrency, numify } from '../utils'

describe('Client Utils Function', () => {
	test('formatCurrency: positive number', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56')
	})

	test('formatCurrency: negative number', () => {
		expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
	})

	test('formatCurrency: rounded number', () => {
		expect(formatCurrency(1234.5678, true)).toBe('$1,235')
	})

	test('numify: valid string', () => {
		expect(numify('$1,234.56')).toBe(1234.56)
	})

	test('numify: invalid string', () => {
		expect(numify('invalid')).toBe(NaN)
	})
})
