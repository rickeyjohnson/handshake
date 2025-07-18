import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	format,
} from 'date-fns'

const CalendarSummary = () => {
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

	return (
		<div className="max-w-xl rounded-xl border-1 border-stone-200 p-4">
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

			<div className="grid grid-cols-7 gap-1">
				{days.map((date, idx) => {
					const isCurrentMonth = isSameMonth(date, monthStart)

					return (
						<div
							key={idx}
							className={`flex h-14 items-center justify-center rounded-md text-sm hover:bg-stone-50 hover:cursor-default bg-white ${
								isCurrentMonth
									? 'text-black'
									: 'text-stone-400/75'
							}`}
						>
							{format(date, 'd')}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default CalendarSummary
