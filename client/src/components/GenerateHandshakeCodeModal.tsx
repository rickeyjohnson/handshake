import { Button } from './Button'
import { Input } from './Input'

const GenerateHandshakeCodeModal = ({ onClick }: { onClick: () => void }) => {
	return (
		<div className="h-screen w-screen bg-gray-400/10 absolute flex justify-center items-center">
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm items-center p-8 gap-2 relative">
				<h1 className="text-xl font-semibold self-start">
					Here is your Handshake Pairing Code
				</h1>
				<p className="self-start text-gray-500 font-light text-md">
					This code allows you to pair with your partner. Give them
					this code in order to pair. This code will expire in 5 minutes.
				</p>

				<Input
					value={'34567'}
					readOnly={true}
					className="mt-2 mb- text-center font-medium text-5xl w-full"
				/>

				<Button onClick={onClick} className="w-full">
					Continue
				</Button>

				<Button
					onClick={onClick}
					variant="ghost"
					className="flex justify-center items-center w-10 h-10 absolute right-2 top-2"
				>
					<span className="material-icons w-6">close</span>
				</Button>
			</div>
		</div>
	)
}

export default GenerateHandshakeCodeModal
