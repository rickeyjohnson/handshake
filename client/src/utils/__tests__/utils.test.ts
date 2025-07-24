import { formatCurrency } from "../utils"

describe('Client Utils Function', () => {
	test('formatCurrency: positive number', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56')
	})
})
