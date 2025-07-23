const Chart = () => {
	const width = 600
	const height = 400

	const points = [
		{ x: 50, y: 350 },
		{ x: 150, y: 200 },
		{ x: 250, y: 300 },
		{ x: 350, y: 100 },
		{ x: 450, y: 250 },
		{ x: 550, y: 150 },
	]

	const pathData = points
		.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `L${p.x} ${p.y}`))
		.join(' ')

	return (
		<svg
			width={width}
			height={height}
            className="border-1"
		>
			<path d={pathData} fill="none" stroke="black" strokeWidth={2} />
		</svg>
	)
}

export default Chart
