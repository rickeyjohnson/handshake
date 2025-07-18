import { useTransactions } from '../contexts/TransactionsContext'
import { formatCategory, formatCurrency } from '../utils/utils'

const Transactions = () => {
  const { transactions } = useTransactions()
  return (
    <div className='rounded-lg'>
      <table className="bg-white flex-3 border-1 border-stone-200">
              <thead>
                <tr className="text-left bg-stone-100">
                  <th className="text-lg font-medium w-md px-3 py-2">Name</th>
                  <th className="text-lg font-medium w-3xs px-3 py-2">Date</th>
                  <th className="text-lg font-medium w-2xs px-3 py-2">User</th>
                  <th className="text-lg font-medium w-sm px-3 py-2">Account</th>
                  <th className="text-lg font-medium pr-3 px-3 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((tx) => {
                  return (
                    <tr key={tx.id} className='border-1 border-stone-200'>
                      <td className="px-3 py-2">{tx.transaction_name}</td>
                      <td className="px-3 py-2">
                        {tx.authorized_date || tx.date}
                      </td>
                      <td className="px-3 py-2 capitalize">
                        {tx.user_name}
                      </td>
                      <td className="px-3 py-2">{tx.account_name}</td>
                      <td className="text-right pr-3 py-2">
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
    </div>
  )
}

export default Transactions