type SimpleLinePlotProps = {
	data: any[]
	width?: number
	height?: number
	margin?: { top: number; right: number; bottom: number; left: number }
	xTickCount?: number
	yTickCount?: number
}

const Chart: React.FC<SimpleLinePlotProps> = ({
	data,
	width = 600,
	height = 400,
	margin = { top: 20, right: 20, bottom: 30, left: 40 },
	xTickCount = 5,
	yTickCount = 5,
}) => {
	if (!data.length) return <p>No data to display</p>

	const chartWidth = width - margin.left - margin.right
	const chartHeight = height - margin.top - margin.bottom

	const xValues = data.map((d) => d.x)
	const yValues = data.map((d) => d.y)
	const minX = Math.min(...xValues)
	const maxX = Math.max(...xValues)
	const minY = Math.min(...yValues)
	const maxY = Math.max(...yValues)

	const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth
	const scaleY = (y: number) =>
		chartHeight - ((y - minY) / (maxY - minY)) * chartHeight

	const pathData = data
		.map((d, i) => {
			const x = scaleX(d.x)
			const y = scaleY(d.y)
			return i === 0 ? `M${x} ${y}` : `L${x} ${y}`
		})
		.join(' ')

	const xTicks = []
	for (let i = 0; i <= xTickCount; i++) {
		const val = minX + ((maxX - minX) / xTickCount) * i
		const x = scaleX(val)
		xTicks.push({ val, x })
	}

	const yTicks = []
	for (let i = 0; i <= yTickCount; i++) {
		const val = minY + ((maxY - minY) / yTickCount) * i
		const y = scaleX(val)
		yTicks.push({ val, y })
	}

	return (
		<svg width={width} height={height} className="border-1">
			<g transform={`translate(${margin.left},${margin.top})`}>
				<path d={pathData} fill="none" stroke="blue" strokeWidth={2} />

				<line
					x1={0}
					y1={chartHeight}
					x2={chartWidth}
					y2={chartHeight}
					stroke="black"
				/>

                <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="black" />
			</g>
		</svg>
	)
}

export default Chart
