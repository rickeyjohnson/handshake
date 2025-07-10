import { createWorker } from 'tesseract.js'

export const extractPricesFromImage = async (image_url: string) => {
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
