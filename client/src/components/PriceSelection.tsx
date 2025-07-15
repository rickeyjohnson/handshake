import { useEffect, useRef, useState } from 'react'
import { extractTextFromImage } from '../utils/ocr'
import type { OCRResult } from '../types/types'
import { getOpenCv, preprocessImage } from '../utils/opencv'

const PriceSelection = ({
	image_url,
	onSelection,
}: {
	image_url: string
	onSelection: (price: string) => void
}) => {
	const originalCanvasRef = useRef<HTMLCanvasElement>(null)
	const processCanvasRef = useRef<HTMLCanvasElement>(null)
	const [boxes, setBoxes] = useState<OCRResult[]>([])
	const [preprocessImageUrl, setPreprocessImageUrl] = useState<string>('')

	const drawRectangle = (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		width: number,
		height: number,
		fill_color: string,
		border_color: string
	) => {
		ctx.strokeStyle = border_color
		ctx.fillStyle = fill_color
		ctx.lineWidth = 2
		ctx.fillRect(x, y, width, height)
		ctx.strokeRect(x, y, width, height)
	}

	const isInsideBox = (x: number, y: number, box: OCRResult) => {
		return (
			x >= box.bbox.x0 &&
			x <= box.bbox.x1 &&
			y >= box.bbox.y0 &&
			y <= box.bbox.y1
		)
	}

	const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const rect = originalCanvasRef.current?.getBoundingClientRect()
		if (!rect) return
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		return { x: x, y: y }
	}

	const handleMouseMove = (
		event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		const coords = getCoords(event)
		if (!coords) return
		const { x, y } = coords
		setBoxes((prev) =>
			prev.map((box) => {
				return { ...box, hovered: isInsideBox(x, y, box) }
			})
		)
	}

	const handleMouseLeave = () => {
		setBoxes((prev) =>
			prev.map((box) => ({
				...box,
				hovered: false,
			}))
		)
	}

	const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const coords = getCoords(event)
		if (!coords) return
		const { x, y } = coords
		setBoxes((prev) =>
			prev.map((box) => ({
				...box,
				selected: isInsideBox(x, y, box),
			}))
		)
	}

	useEffect(() => {
		const canvas = originalCanvasRef.current
		const ctx = canvas?.getContext('2d')

		if (!canvas || !ctx) return

		const image = new Image()
		image.src = image_url

		image.onload = async () => {
			canvas.width = image.width
			canvas.height = image.height

			ctx.drawImage(image, 0, 0)
			
			boxes.map((box) => {
				let fillColor = ''
				let borderColor = 'red'

				if (box.selected) {
					fillColor = 'rgba(0, 120, 255, 0.5)'
					onSelection(box.text)
				} else if (box.hovered) {
					fillColor = 'rgba(0, 120, 255, 0.2)'
				} else {
					fillColor = 'rgba(0, 0, 0, 0.5)'
				}

				return drawRectangle(
					ctx,
					box.bbox.x0,
					box.bbox.y0,
					box.bbox.x1 - box.bbox.x0,
					box.bbox.y1 - box.bbox.y0,
					fillColor,
					borderColor
				)
			})
		}
	}, [boxes, image_url])

	useEffect(() => {
		const canvas = processCanvasRef.current
		const ctx = canvas?.getContext('2d')

		if (!canvas || !ctx) return

		const image = new Image()
		image.src = image_url

		image.onload = async () => {
			canvas.width = image.width
			canvas.height = image.height

			ctx.drawImage(image, 0, 0)

			const cv = await getOpenCv()
			const src = cv.imread(canvas)

			// 1. grayscale image
			const gray = new cv.Mat()
			cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY, 0)

			// 2. threshold
			const bw = new cv.Mat()
			cv.threshold(gray, bw, 150, 255, cv.THRESH_BINARY)

			cv.imshow(canvas, bw)
			const processedUrl = canvas.toDataURL('image/png')
			setPreprocessImageUrl(processedUrl)

			gray.delete()
			bw.delete()
		}
	}, [image_url])

	useEffect(() => {
		const runOCR = async () => {
			const newBoxes = await extractTextFromImage(preprocessImageUrl)
			if (newBoxes) setBoxes(newBoxes)
		}

		runOCR()
	}, [preprocessImageUrl])

	return (
		<div>
			<p>preprocess</p>
			<canvas ref={processCanvasRef} />

			<h1>ocr part:</h1>
			<canvas
				ref={originalCanvasRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onClick={handleClick}
			/>
		</div>
	)
}

export default PriceSelection
