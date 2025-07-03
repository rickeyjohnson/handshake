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
	let base = 'px-4 py-2 rounded-md hover:cursor-pointer'

	switch (variant) {
		case 'ghost':
			base += ' hover:bg-gray-100'
			break

		case 'clear':
			base +=
				' bg-white border-3 border-gray-200 hover:bg-slate-950 hover:text-white hover:border-slate-950'
			break

		default:
			base += ' bg-slate-950 text-white hover:bg-slate-900'
			break
	}

	return (
		<button className={`${base} ${className}`} {...props}>
			{children}
		</button>
	)
}
