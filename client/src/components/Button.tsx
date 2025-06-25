import React from 'react'

type Button = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode
	className?: string
}

const Button = ({ children, className = '', ...props }: Button) => {
	const base = 'bg-slate-900 text-slate-50 px-4 py-2 rounded-md'

	return (
		<button className={`${base} ${className}`} {...props}>
			{children}
		</button>
	)
}

Button.propTypes = {}

export default Button
