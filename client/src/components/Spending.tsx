import { formatCurrency } from '../utils/utils'
import type { SpendingData } from '../types/types'
import GraphChart from './GraphChart'

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
					<GraphChart data={data} height={300} />
				</div>
			</div>
		</div>
	)
}

export default Spending
