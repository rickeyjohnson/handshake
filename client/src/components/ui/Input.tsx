import type { InputType } from '../../types/types'

export const Input = ({ className, variant, ...props }: InputType) => {
	const base = `border rounded-lg mb-5 p-2 pl-4 border-gray-400 focus:outline-4 outline-gray-300 `

	return <input className={`${base} ${className}`} {...props}></input>
}
