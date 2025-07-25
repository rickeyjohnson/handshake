import { extractTextFromImage, parseOCRData } from '../../utils/ocr'
import type { OCRNode, OCRResult } from '../../types/types'
import * as tesseract from 'tesseract.js'

jest.mock('tesseract.js', () => ({
	createWorker: jest.fn(),
}))

const mockRecognize = jest.fn()
const mockTerminate = jest.fn()

beforeEach(() => {
	jest.clearAllMocks()
	;(tesseract.createWorker as jest.Mock).mockResolvedValue({
		recognize: mockRecognize,
		terminate: mockTerminate,
	})
})

describe('ocr.ts test cases', () => {
	const { isValid } = jest.requireActual('../../utils/ocr')
	it('returns true for string with dollar sign and length > 1', () => {
		expect(isValid('$1.23')).toBe(true)
	})

	it('returns true for numeric string without $', () => {
		expect(isValid('42')).toBe(true)
	})

	it('returns false for non-numeric short string without $', () => {
		expect(isValid('a')).toBe(false)
	})

    const { normalize } = jest.requireActual('../../utils/ocr')
	it('removes $ symbols', () => {
		expect(normalize('$123.45')).toBe('123.45')
	})

	it('returns original string if no $', () => {
		expect(normalize('99.99')).toBe('99.99')
	})

    it('parses valid OCRNode data', () => {
		const input: OCRNode[] = [
			{
				text: '$5.00',
				bbox: {x0: 0, y0: 0, x1: 10, y1: 10},
				symbols: [{}],
			},
			{
				text: 'invalid',
				bbox: {x0: 10, y0: 10, x1: 20, y1: 20},
				symbols: [{}],
			},
			{
				text: '12.34',
				bbox: {x0: 30, y0: 30, x1: 40, y1: 40},
				symbols: [{}],
			},
		]

		const result = parseOCRData(input)
		expect(result).toEqual([
			{ text: '5.00', bbox: {x0: 0, y0: 0, x1: 10, y1: 10}, selected: false, hovered: false },
			{ text: '12.34', bbox: {x0: 30, y0: 30, x1: 40, y1: 40}, selected: false, hovered: false },
		])
    })

    it('returns parsed text when recognition succeeds', async () => {
		mockRecognize.mockResolvedValue({
			data: {
				blocks: [
					{ text: '$8.99', bbox: [0, 0, 1, 1], symbols: [{}] },
					{ text: 'foo', bbox: [2, 2, 3, 3], symbols: [{}] },
				],
			},
		})

		const result = await extractTextFromImage('mock-url')
		expect(result).toEqual([
			{ text: '8.99', bbox: [0, 0, 1, 1], selected: false, hovered: false },
		])
		expect(mockTerminate).toHaveBeenCalled()
	})

	it('returns empty array on error', async () => {
		;(tesseract.createWorker as jest.Mock).mockRejectedValue(new Error('fail'))
		const result = await extractTextFromImage('bad-url')
		expect(result).toEqual([])
	})
})