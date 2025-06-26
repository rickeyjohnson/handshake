type Input = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string
	variant?: string
}

export const Input = ({ className, variant, ...props }: Input) => {
	const base = `border rounded-lg mb-5 p-2 pl-4 border-gray-400 focus:outline-4 outline-gray-300 `

	return <input className={`${base} ${className}`} {...props}></input>
}
