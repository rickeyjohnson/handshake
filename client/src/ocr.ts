import { createWorker } from 'tesseract.js'

type OCRBBox = {
    x0: number,
    y0: number,
    x1: number,
    y1: number,
}

type OCRNode = {
    text?: string
    bbox?: OCRBBox
	symbols?: OCRNode[]
	words?: OCRNode[]
	lines?: OCRNode[]
	paragraphs?: OCRNode[]
}

type OCRResult = {
	text: string
	bbox: OCRBBox
}

export const extractTextFromImage = async (image_url: string) => {
	const worker = await createWorker('eng')
	const { data } = await worker.recognize(
		image_url,
		{},
		{
			blocks: true,
		}
	)

	await worker.terminate()
	return data
}

export const parseOCRData = (data: OCRNode[], result: OCRResult[] = []) => {
  
  for (const item of data) {
    if (item.symbols) {
        console.log('stop'); result.push(
        
        {
			text: item.text!,
			bbox: item.bbox!,
		})
    }
    if (item.words) {parseOCRData(item.words, result)}
    if (item.lines) {parseOCRData(item.lines, result)}
    if (item.paragraphs) {console.log('paragraphs'); parseOCRData(item.paragraphs, result)}
  }

  return result
}
