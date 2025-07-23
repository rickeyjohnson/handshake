import { IconLoader2 } from "@tabler/icons-react"

const Loader = ({ color='#ededed', backgroundColor='bg-stone-950/60', className }: { color?: string, backgroundColor?: string, className?: string }) => {
	return (
		<div className={`box-border flex justify-center items-center w-full h-full ${backgroundColor} ${className}`}>
			<IconLoader2 color={color} size={75} className="animate-spin" />
		</div>
	)
}

export default Loader
