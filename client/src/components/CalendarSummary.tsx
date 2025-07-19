import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	format,
} from 'date-fns'
import { useTransactions } from '../contexts/TransactionsContext'
import { formatCurrency, getNetSpendingForDay } from '../utils/utils'
import { Tooltip } from 'react-tooltip'

const CalendarSummary = () => {
	const { transactions } = useTransactions()

	const today = new Date()
	const monthStart = startOfMonth(today)
	const monthEnd = endOfMonth(monthStart)
	const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }) // Saturday

	const days = []
	let day = calendarStart
	while (day <= calendarEnd) {
		days.push(day)
		day = addDays(day, 1)
	}

	const bubbleColor = (net: number) => {
		if (net < 0) return 'bg-red-600'
		if (net > 0) return 'bg-lime-600'
	}

	return (
		<div>
      <h1 className="py-2">Calendar</h1>
      <div className="shadow w-full h-[calc(100%-40px)] rounded-xl border-1 border-stone-200 p-4">
        <h1 className="w-full flex justify-center p-4">
          {new Date().toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h1>
        <div className="grid grid-cols-7 text-center my-4 text-stone-500 font-light">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
            (day) => (
              <div key={day}>{day}</div>
            )
          )}
        </div>
      
        {transactions && (
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, idx) => {
              const isCurrentMonth = isSameMonth(date, monthStart)
              const netSpending = getNetSpendingForDay(
                transactions,
                date
              )
      
              return (
                <div>
                  <div
                    key={idx}
                    id={`${idx}`}
                    className={`day-${idx} relative flex h-14 items-center justify-center rounded-xl text-sm hover:bg-stone-50 hover:cursor-default bg-white ${
                      isCurrentMonth
                        ? 'text-black'
                        : 'text-stone-400/75'
                    }`}
                  >
                    {format(date, 'd')}
                    <span
                      className={`absolute top-1.5 right-2.5 w-2.5 h-2.5 rounded-full ${bubbleColor(
                        netSpending
                      )}`}
                    />
                  </div>
                  <Tooltip
                    anchorSelect={`.day-${idx}`}
                    place="top"
                  >
                    {netSpending > 0 ? '+' : ''}
                    {formatCurrency(netSpending, true)}
                  </Tooltip>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
	)
}

export default CalendarSummary
