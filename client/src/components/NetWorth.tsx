import { useUser } from '../contexts/UserContext'
import { formatCurrency } from '../utils/utils'

const NetWorth = ({
	networth,
	userNetworth,
	partnerNetworth,
}: {
	networth: number
	userNetworth: number
	partnerNetworth: number
}) => {
	const { user } = useUser()

	return (
		<div className='w-full h-full'>
			<h1 className="py-2">Net Worth</h1>
			<div className="shadow rounded-xl border-1 w-full h-[calc(100%-40px)] border-stone-200 py-6 px-8 flex flex-col">
				<div className='flex-1'>
          <h1 className="mb-2 p-1">Total Net Worth</h1>
          <p className="text-5xl font-medium mb-3 p-1">
            {formatCurrency(networth, true)}
          </p>
        </div>

				<div className="p-1 w-full">
					<div className="flex py-1">
						<p className="capitalize flex-1">Your net worth:</p>
						<span className="font-medium">
							{formatCurrency(userNetworth, true)}
						</span>
					</div>
					<div className="flex py-1">
						<p className="capitalize flex-1">
							{user?.partner.name}'s net worth:
						</p>
						<span className="font-medium">
							{formatCurrency(partnerNetworth, true)}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NetWorth
