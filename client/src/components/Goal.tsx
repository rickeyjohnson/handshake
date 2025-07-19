const Goal = ({
	title,
	current,
	target,
	onClick
}: {
	title: string
	current: number
	target: number
	onClick: () => void
}) => {
	
	return (
		<div className="bg-slate-800 h-45 w-2xs relative shrink rounded-xl bg-[url(https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=1000&q=80)] bg-center bg-cover bg-no-repeat hover:cursor-pointer" onClick={onClick}>
			<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black to-70% flex flex-col justify-end p-4 text-white rounded-xl">
				<h1 className="font-medium text-sm uppercase tracking-wider">
					{title ?? 'Test Goal'}
				</h1>
				<p className="text-3xl font-medium mb-2">${current ?? 0}</p>

				<div className="w-full bg-orange-500 rounded-full h-2.5 dark:bg-gray-700">
					<div
						className={'bg-gray-200 h-2.5 rounded-full'}
						style={{ width: `${((current / target) * 100)}%` }}
					></div>
				</div>
			</div>
		</div>
	)
}

export default Goal
