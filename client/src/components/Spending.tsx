import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatCurrency, formatXAxis, formatYAxis } from '../utils/utils'
import type { SpendingData } from '../types/types'

const Spending = ({ total, data }: { total: number; data: SpendingData[] }) => {
	return (
		<div className="w-full h-full">
			<h1 className="py-2">Spending</h1>
			<div className="shadow w-full h-[calc(100%-40px)] rounded-xl border-1 border-stone-200 py-6 px-8 flex flex-col">
				<h1 className="mb-2 p-1">Total Month Spendning</h1>
				<p className="text-5xl font-medium mb-3 p-1 truncate">
					{formatCurrency(Math.abs(total))}
				</p>

				<div className="w-full h-45">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<YAxis
								dataKey="total"
								tickFormatter={formatYAxis}
								orientation="right"
							/>
							<XAxis
								dataKey="date"
								padding={{ left: 30 }}
								tickFormatter={formatXAxis}
								interval={Math.round(data.length / 4)}
							/>
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
		</div>
	)
}

export default Spending
