import { IconLoader2 } from "@tabler/icons-react"

const Loader = ({ color }: { color?: string }) => {
	return (
		<div className="absolute flex justify-center items-center w-full h-full bg-stone-950/60">
			<IconLoader2 color={color || `#ededed`} size={75} className="animate-spin" />
		</div>
	)
}

export default Loader
