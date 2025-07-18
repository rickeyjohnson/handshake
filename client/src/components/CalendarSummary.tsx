const CalendarSummary = () => {
  return (
    <div className="max-w-xl rounded-xl border-1 border-stone-200">
      <div className="grid grid-cols-7 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
    </div>
  )
}

export default CalendarSummary