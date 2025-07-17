import { useUser } from '../contexts/UserContext'
import { formatCurrency } from '../utils/utils'

const NetWorth = ({networth, userNetworth, partnerNetworth} : {networth: number, userNetworth: number, partnerNetworth: number}) => {
  const { user } = useUser()

  return (
    <div className='rounded-lg border-1 border-stone-200 p-4 w-fit'>
      <h1 className='mb-2'>Total Net Worth</h1>
      <p className='text-5xl font-medium'>{formatCurrency(networth, true)}</p>

      <p className='capitalize'>{user?.name}'s net worth: {formatCurrency(userNetworth, true)}</p>
      <p className='capitalize'>{user?.partner.name}'s net worth: {formatCurrency(partnerNetworth, true)}</p>
    </div>
  )
}

export default NetWorth