import { useEffect, useRef, useState } from 'react'
import type { SpendingData } from '../../types/types'
import { formatCurrency, formatXAxis } from '../../utils/utils'

type SimpleLinePlotProps = {
	data: SpendingData[]
	width?: number
	height?: number
	margin?: { top: number; right: number; bottom: number; left: number }
	xTickCount?: number
	yTickCount?: number
	animationDuration?: number
}

const LineChart: React.FC<SimpleLinePlotProps> = ({
	data,
	width,
	height,
	margin = { top: 20, right: 50, bottom: 30, left: 20 },
	xTickCount = 4,
	yTickCount = 4,
	animationDuration = 3000,
}) => {
	if (data.length < 2) return <p>No data to display</p>

	const containerRef = useRef<HTMLDivElement>(null)
	const [containerWidth, setContainerWidth] = useState<number>(width || 600)
	const [containerHeight, setContainerHeight] = useState<number>(
		height || 400
	)
	const pathRef = useRef<SVGPathElement>(null)
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)

	const chartWidth = containerWidth - margin.left - margin.right
	const chartHeight = containerHeight - margin.top - margin.bottom

	const xValues = data.map((d) => d.date.getTime())
	const yValues = data.map((d) => d.total)
	const minX = Math.min(...xValues)
	const maxX = Math.max(...xValues)
	const minY = Math.min(...yValues)
	const maxY = Math.max(...yValues)

	const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth
	const scaleY = (y: number) =>
		chartHeight - ((y - minY) / (maxY - minY)) * chartHeight

	const getSmoothPath = (points: { x: number; y: number }[]) => {
		if (points.length < 2) return ''

		const smoothing = 0.1

		const d = [`M${points[0].x} ${points[0].y}`]

		for (let i = 0; i < points.length - 1; i++) {
			const curr = points[i]
			const next = points[i + 1]
			const prev = points[i - 1] || curr
			const next2 = points[i + 2] || next

			const ctrl1x = curr.x + (next.x - prev.x) * smoothing
			const ctrl1y = curr.y + (next.y - prev.y) * smoothing

			const ctrl2x = next.x - (next2.x - curr.x) * smoothing
			const ctrl2y = next.y - (next2.y - curr.y) * smoothing

			d.push(
				`C${ctrl1x} ${ctrl1y}, ${ctrl2x} ${ctrl2y}, ${next.x} ${next.y}`
			)
		}

		return d.join(' ')
	}

	const handleMouseMove = (
		event: React.MouseEvent<SVGSVGElement, MouseEvent>
	) => {
		if (!containerRef.current) return

		const bounds = containerRef.current.getBoundingClientRect()
		const mouseX = event.clientX - bounds.left - margin.left

		let closestIndex = 0
		let closestDistance = Infinity

		points.forEach((p, i) => {
			const dist = Math.abs(p.x - mouseX)
			if (dist < closestDistance) {
				closestDistance = dist
				closestIndex = i
			}
		})

		setHoverIndex(closestIndex)
	}

	const handleMouseLeave = () => {
		setHoverIndex(null)
	}

	const points = data.map((d) => ({
		x: scaleX(d.date.getTime()),
		y: scaleY(d.total),
	}))

	const pathData = getSmoothPath(points)

	const xTicks = []
	for (let i = 0; i <= xTickCount; i++) {
		const val = new Date(minX + ((maxX - minX) / xTickCount) * i)
		const x = (i / xTickCount) * chartWidth
		xTicks.push({ val: val.toLocaleDateString(), x: x })
	}

	const yTicks = []
	for (let i = 0; i <= yTickCount; i++) {
		const val = minY + ((maxY - minY) / yTickCount) * i
		const y = scaleY(val)
		yTicks.push({ val, y })
	}

	useEffect(() => {
		if (!pathRef.current || data.length === 0) return

		const path = pathRef.current
		const pathLength = path.getTotalLength()

		path.style.strokeDasharray = `${pathLength}`
		path.style.strokeDashoffset = `${pathLength}`

		let startTime: number | null = null

		const animate = (time: number) => {
			if (!startTime) startTime = time
			const elasped = time - startTime
			const progress = Math.min(elasped / animationDuration, 1)
			const easedProgress = 1 - Math.pow(1 - progress, 3)

			path.style.strokeDashoffset = `${pathLength * (1 - easedProgress)}`
			

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				path.style.strokeDasharray = ''
				path.style.strokeDashoffset = ''
			}
		}

		requestAnimationFrame(animate)
	}, [data, animationDuration, containerWidth])

	useEffect(() => {
		if (width) {
			setContainerWidth(width)
		}

		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect()
			setContainerWidth(width || rect.width)
			setContainerHeight(rect.height || height!)
		}

		const handleResize = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect()
				setContainerWidth(width || rect.width)
				setContainerHeight(rect.height || height!)
			}
		}

		const resizeObserver = new ResizeObserver(() => {
			handleResize()
		})

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			resizeObserver.disconnect()
			window.removeEventListener('resize', handleResize)
		}
	}, [width, height])

	return (
		<div ref={containerRef} className="w-full h-full z-10">
			<svg
				width={containerWidth}
				height={containerHeight}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<g transform={`translate(${margin.left},${margin.top})`}>
					<path
						ref={pathRef}
						d={pathData}
						fill="none"
						stroke="black"
						strokeWidth={3}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					<line
						x1={0}
						y1={chartHeight}
						x2={chartWidth}
						y2={chartHeight}
						stroke="black"
					/>

					<line
						x1={chartWidth}
						y1={0}
						x2={chartWidth}
						y2={chartHeight}
						stroke="black"
					/>

					{xTicks.map(({ val, x }, i) => (
						<g key={i} transform={`translate(${x},${chartHeight})`}>
							<line y2={6} stroke="black" />
							<text
								y={20}
								textAnchor="middle"
								fontSize={12}
								fill="black"
							>
								{formatXAxis(val)}
							</text>
						</g>
					))}

					{yTicks.map(({ val, y }, i: number) => (
						<g key={`y-tick-${i}`}>
							<line
								x1={chartWidth}
								y1={y}
								x2={chartWidth + 5}
								y2={y}
								stroke="black"
								strokeWidth="1"
							/>
							<text
								x={chartWidth + 10}
								y={y + 4}
								textAnchor="start"
								fontSize="12"
								fill="black"
							>
								{formatCurrency(val, true)}
							</text>
						</g>
					))}

					{hoverIndex !== null && (
						<>
							<circle
								cx={points[hoverIndex].x}
								cy={points[hoverIndex].y}
								r={4}
								fill="black"
								stroke="white"
								strokeWidth={2}
							/>

							<text
								x={points[hoverIndex].x}
								y={points[hoverIndex].y - 13}
								textAnchor="middle"
								fontSize={12}
								fill="black"
								fontWeight="semibold"
								alignmentBaseline="middle"
							>
								{formatCurrency(data[hoverIndex].total, true)}
							</text>
						</>
					)}
				</g>
			</svg>
		</div>
	)
}

export default LineChart
