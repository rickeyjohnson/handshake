import React from 'react'

type Label = React.LabelHTMLAttributes<HTMLLabelElement> & {
	children?: React.ReactNode
	className?: string
}

export const Label = ({ children, className, ...props }: Label) => {
	const base = 'mb-1 font-medium'
	return (
		<label className={`${base} ${className}`} {...props}>
			{children}
		</label>
	)
}
