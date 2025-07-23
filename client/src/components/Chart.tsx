type SimpleLinePlotProps = {
	data: any[]
	width?: number
	height?: number
	margin: { top: number; right: number; bottom: number; left: number }
}

const Chart: React.FC<SimpleLinePlotProps> = ({
	data,
	width = 600,
	height = 400,
	margin = { top: 20, right: 20, bottom: 30, left: 40 },
}) => {
	if (!data.length) return <p>No data to display</p>

	const chartWidth = width - margin.left - margin.right
	const chartHeight = height - margin.top - margin.bottom

	return (
		<svg width={width} height={height} className="border-1">
			<path d={pathData} fill="none" stroke="black" strokeWidth={2} />
		</svg>
	)
}

export default Chart
