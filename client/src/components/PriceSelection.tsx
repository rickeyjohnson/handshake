import { useEffect, useRef, useState } from 'react'
import { extractTextFromImage, type OCRResult } from '../ocr'

// remove any before pushing
const PriceSelection = ({ image_url }: { image_url: string }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [data, setData] = useState<OCRResult[]>([])

	const drawRectangle = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number
	) => {
		ctx.strokeStyle = 'red'
		ctx.lineWidth = 2
		ctx.strokeRect(x, y, width, height)
	}

	useEffect(() => {
		const runOCR = async () => {
			const newData = await extractTextFromImage(image_url)
			if (newData) setData(newData)
		}

		runOCR()
	}, [image_url])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')

		if (!canvas || !ctx) return

		const image = new Image()
		image.src = image_url

		image.onload = () => {
			canvas.width = image.width
			canvas.height = image.height

			ctx.drawImage(image, 0, 0)

			data.map((item) => {
				return drawRectangle(
					ctx,
					item.bbox.x0,
					item.bbox.y0,
					item.bbox.x1 - item.bbox.x0,
					item.bbox.y1 - item.bbox.y0
				)
			})
		}
	}, [data, image_url])

	return (
		<div>
			<canvas ref={canvasRef} />
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	)
}

export default PriceSelection
