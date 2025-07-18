import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../utils/utils'
import type { SpendingData } from '../types/types'

const Spending = ({
	total,
	data,
}: {
	total: number
	data: SpendingData[]
}) => {
  const formatter = (value: number) => `$${value}`
	return (
		<div className="rounded-xl border-1 border-stone-200 py-6 px-8 w-fit flex flex-col">
			<h1 className="mb-2 p-1">Total Month Spendning</h1>
			<p className="text-5xl font-medium mb-3 p-1">
				{formatCurrency(Math.abs(total))}
			</p>

			<div className="w-96 h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<YAxis dataKey="total" tickFormatter={formatter}/>
						<XAxis />
						<Line
							type="monotone"
							dataKey="total"
							dot={false}
							stroke="black"
							strokeWidth={3}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

export default Spending
