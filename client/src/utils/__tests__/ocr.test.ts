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
})