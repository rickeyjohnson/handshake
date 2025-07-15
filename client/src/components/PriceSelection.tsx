import { useEffect, useRef, useState } from 'react'
import { extractTextFromImage } from '../ocr'
import type { OCRResult } from '../types/types'

const PriceSelection = ({
	image_url,
	onSelection,
}: {
	image_url: string
	onSelection: (price: string) => void
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [boxes, setBoxes] = useState<OCRResult[]>([])

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
		const rect = canvasRef.current?.getBoundingClientRect()
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
		const runOCR = async () => {
			const newBoxes = await extractTextFromImage(image_url)
			if (newBoxes) setBoxes(newBoxes)
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

	return (
		<div>
			<h1>ocr part:</h1>
			<canvas
				ref={canvasRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onClick={handleClick}
			/>
		</div>
	)
}

export default PriceSelection
