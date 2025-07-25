import { createWorker } from 'tesseract.js'
import type { OCRNode, OCRResult } from '../types/types'

export const isValid = (str: string) => {
	return (str.includes('$') && str.length > 1) || !isNaN(Number(str))
}

const normalize = (str: string) => {
	let newStr = ''
	if (str.includes('$')) {
		newStr = str.split("$").join("")
	}

	return newStr || str
}

export const extractTextFromImage = async (image_url: string) => {
	try {
		const worker = await createWorker('eng')
		const {
			data: { blocks },
		} = await worker.recognize(
			image_url,
			{},
			{
				blocks: true,
			}
		)

		await worker.terminate()
		return parseOCRData(blocks)
	} catch (error) {
		console.error()
		return []
	}
}

export const parseOCRData = (
	data: OCRNode[] | null,
	result: OCRResult[] = []
) => {
	if (!data) return
	for (const item of data) {
		if (item.symbols && isValid(item.text!)) {
			result.push({
				text: normalize(item.text!),
				bbox: item.bbox!,
				selected: false,
				hovered: false,
			})
		}
		if (item.words) {
			parseOCRData(item.words, result)
		}
		if (item.lines) {
			parseOCRData(item.lines, result)
		}
		if (item.paragraphs) {
			parseOCRData(item.paragraphs, result)
		}
	}

	return result
}
