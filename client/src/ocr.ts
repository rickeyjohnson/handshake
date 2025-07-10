import { createWorker } from 'tesseract.js'

type OCRBBox = {
	x0: number
	y0: number
	x1: number
	y1: number
}

type OCRNode = {
	text?: string
	bbox?: OCRBBox
	symbols?: OCRNode[]
	words?: OCRNode[]
	lines?: OCRNode[]
	paragraphs?: OCRNode[]
}

export type OCRResult = {
	text: string
	bbox: OCRBBox
}

const isValid = (str: string) => {
	return /^\w+$/.test(str)
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
				text: item.text!,
				bbox: item.bbox!,
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
