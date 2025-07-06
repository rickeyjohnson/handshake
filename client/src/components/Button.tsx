import React from 'react'

type Button = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode
	variant?: string
	className?: string
}

export const Button = ({
	children,
	variant,
	className = '',
	...props
}: Button) => {
	let base = 'hover:cursor-pointer'

	switch (variant) {
		case 'ghost':
			base += ' px-4 py-2 rounded-md  hover:bg-gray-100'
			break

		case 'clear':
			base +=
				' px-4 py-2 rounded-md bg-white border-3 border-gray-200 hover:bg-slate-950 hover:text-white hover:border-slate-950'
			break

		case 'dashboard':
			base +=
				' text-sm flex items-center gap-2 text-slate-950 p-2 pl-3 w-full rounded-lg'
			break

		default:
			base +=
				' px-4 py-2 rounded-md bg-slate-950 text-white hover:bg-slate-900'
			break
	}

	return (
		<button className={`${base} ${className}`} {...props}>
			{children}
		</button>
	)
}
