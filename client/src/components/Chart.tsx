import { useEffect, useRef, useState } from 'react'

type SimpleLinePlotProps = {
	data: any[]
	width?: number
	height?: number
	margin?: { top: number; right: number; bottom: number; left: number }
	xTickCount?: number
	yTickCount?: number
	animationDuration?: number
}

const Chart: React.FC<SimpleLinePlotProps> = ({
	data,
	width = 600,
	height = 400,
	margin = { top: 20, right: 40, bottom: 30, left: 20 },
	xTickCount = 5,
	yTickCount = 5,
	animationDuration = 3000,
}) => {
	const pathRef = useRef<SVGPathElement>(null)
	const [animationProgress, setAnimationProgress] = useState<number>(0)

	if (!data.length) return <p>No data to display</p>

	const chartWidth = width - margin.left - margin.right
	const chartHeight = height - margin.top - margin.bottom

	const xValues = data.map((d) => d.x)
	const yValues = data.map((d) => d.y)
	const minX = Math.min(...xValues)
	const maxX = Math.max(...xValues)
	const minY = Math.min(...yValues)
	const maxY = Math.max(...yValues)

	const getSmoothPath = (points: { x: number; y: number }[]) => {
		if (points.length < 2) return ''

		const d = [`M${points[0].x} ${points[1].y}`]

		for (let i = 0; i < points.length - 1; i++) {
			const curr = points[i]
			const next = points[i + 1]
			const prev = points[i - 1] || curr
			const next2 = points[i + 2] || next

			const ctrl1x = curr.x + (next.x - prev.x) / 6
			const ctrl1y = curr.y + (next.y - prev.y) / 6

			const ctrl2x = next.x - (next2.x - curr.x) / 6
			const ctrl2y = next.y - (next2.y - curr.y) / 6

			d.push(
				`C${ctrl1x} ${ctrl1y}, ${ctrl2x} ${ctrl2y}, ${next.x} ${next.y}`
			)
		}

		return d.join(' ')
	}

	const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth
	const scaleY = (y: number) =>
		chartHeight - ((y - minY) / (maxY - minY)) * chartHeight

	const points = data.map((d) => ({ x: scaleX(d.x), y: scaleY(d.y) }))
	const pathData = getSmoothPath(points)

	const xTicks = []
	for (let i = 0; i <= xTickCount; i++) {
		const val = minX + ((maxX - minX) / xTickCount) * i
		const x = scaleX(val)
		xTicks.push({ val, x })
	}

	const yTicks = []
	for (let i = 0; i <= yTickCount; i++) {
		const val = minY + ((maxY - minY) / yTickCount) * i
		const y = scaleY(val)
		yTicks.push({ val, y })
	}

	const yAxisX = chartWidth

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
			setAnimationProgress(easedProgress)

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				path.style.strokeDasharray = ''
				path.style.strokeDashoffset = ''
			}
		}

		requestAnimationFrame(animate)
	}, [data, animationDuration])

	return (
		<svg width={width} height={height} className="border-1">
			<g transform={`translate(${margin.left},${margin.top})`}>
				<path
					ref={pathRef}
					d={pathData}
					fill="none"
					stroke="blue"
					strokeWidth={2}
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
					x1={yAxisX}
					y1={0}
					x2={yAxisX}
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
							{val.toFixed(1)}
						</text>
					</g>
				))}

				{yTicks.map(({ val, y }, i: number) => (
					<g key={`y-tick-${i}`}>
						<line
							x1={yAxisX}
							y1={y}
							x2={yAxisX + 5} // Tick extends right of axis line
							y2={y}
							stroke="#666"
							strokeWidth="1"
						/>
						<text
							x={yAxisX + 10} // Label further right from tick
							y={y + 4}
							textAnchor="start" // Align text to the start (left) for right side axis
							fontSize="12"
							fill="#666"
						>
							{val.toFixed(1)}
						</text>
					</g>
				))}
			</g>
		</svg>
	)
}

export default Chart
