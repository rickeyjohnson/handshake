import { useUser } from '../contexts/UserContext'
import { formatCurrency } from '../utils/utils'

const NetWorth = ({networth, userNetworth, partnerNetworth} : {networth: number, userNetworth: number, partnerNetworth: number}) => {
  const { user } = useUser()

  return (
    <div className='rounded-xl border-1 border-stone-200 py-6 px-8 w-fit flex flex-col'>
      <h1 className='mb-2 p-1'>Total Net Worth</h1>
      <p className='text-5xl font-medium mb-3 p-1'>{formatCurrency(networth, true)}</p>

      <div className='p-1'>
        <p className='capitalize'>{user?.name}'s net worth: {formatCurrency(userNetworth, true)}</p>
        <p className='capitalize'>{user?.partner.name}'s net worth: {formatCurrency(partnerNetworth, true)}</p>
      </div>
    </div>
  )
}

export default NetWorth