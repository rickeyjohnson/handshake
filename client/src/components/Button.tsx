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
	let base = 'px-4 py-2 rounded-md'

	switch (variant) {
		case 'ghost':
			base += ' hover:bg-gray-100'
			break

		default:
			base += ' bg-slate-950 text-white'
			break
	}

	return (
		<button className={`${base} ${className}`} {...props}>
			{children}
		</button>
	)
}
