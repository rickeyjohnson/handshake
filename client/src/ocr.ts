import { createWorker } from 'tesseract.js'

export const extractPricesFromImage = async (image_url: string) => {
    const worker = await createWorker('eng')
    const { data: { text }} = await worker.recognize(image_url)
    console.log(text)
    await worker.terminate()
}