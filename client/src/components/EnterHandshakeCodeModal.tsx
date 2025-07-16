import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useState } from 'react'

const EnterHandshakeCodeModal = ({ onClick }: { onClick: () => void }) => {
	const [code, setCode] = useState('')

	const handlePairing = async () => {
		try {
			const response = await fetch('/api/pair/enter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code: code,
				}),
			})
			const data = await response.json()
			console.log(data)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="h-screen w-screen bg-gray-400/10 absolute flex justify-center items-center">
			<div className="bg-white flex flex-col rounded-2xl border border-gray-300 max-w-md min-w-sm items-center p-8 gap-2 relative">
				<h1 className="text-xl font-semibold self-start">
					Enter your partner's Handshake Pairing Code
				</h1>
				<p className="self-start text-gray-500 font-light text-md">
					Enter Handshake Pairing Code to verify and link with your
					partner's Handshake account.
				</p>

				<Input
					placeholder="XXXXX"
					value={code}
					onChange={(e) => {
						if (e.target.value.length < 6) {
							setCode(e.target.value.toUpperCase())
						}
					}}
					className="mt-2 mb- text-center font-medium text-5xl w-full"
				/>

				<Button
					onClick={() => {
						handlePairing()
						onClick()
					}}
					className="w-full"
				>
					Pair
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

export default EnterHandshakeCodeModal
