import type { LabelType } from '../../types/types'

export const Label = ({ children, className, ...props }: LabelType) => {
	const base = 'mb-1 font-medium'
	return (
		<label className={`${base} ${className}`} {...props}>
			{children}
		</label>
	)
}
