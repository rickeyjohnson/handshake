import { Link, useNavigate } from 'react-router'
import { Button } from '../components/ui/Button'
import { useEffect, useState } from 'react'
import GenerateHandshakeCodeModal from '../components/GenerateHandshakeCodeModal'
import EnterHandshakeCodeModal from '../components/EnterHandshakeCodeModal'
import { useUser } from '../contexts/UserContext'
import { useWebSocket, WebSocketProvider } from '../contexts/WebsocketContext'

const PairPage = () => {
	const [showGenerateHandshakeCodeModal, setShowGenerateHandshakeCodeModal] =
		useState(false)
	const [showEnterHandshakeCodeModal, setShowEnterHandshakeCodeModal] =
		useState(false)
	const { user, fetchUser } = useUser()
	const navigate = useNavigate()
	const { socket } = useWebSocket()

	useEffect(() => {
		if (user?.is_paired) {
			navigate('/dashboard')
			return
		}
	}, [])

	useEffect(() => {
		if (!socket) return

		const handleNewPair = async (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)

				if (data.action === 'PAIR') {
					navigate('/dashboard')
				}
			} catch (error) {
				console.warn(error)
			}
		}

		socket.addEventListener('message', handleNewPair)

		return () => socket.removeEventListener('message', handleNewPair)
	}, [socket])

	return (
		<WebSocketProvider>
			<div className="flex justify-center items-center h-screen relative">
				<Link to="/login" className="absolute left-5 top-5">
					<Button
						variant="ghost"
						className="flex justify-center items-center"
						title="Back"
					>
						<span className="material-icons">arrow_back</span>
					</Button>
				</Link>

				<div className="flex flex-col justify-center items-center gap-4 w-md relative">
					<h1 className="text-center text-3xl capitalize">
						{user?.name}, it's time to pair with your partner.
					</h1>

					<Button
						variant="clear"
						className="w-md"
						title="Generate Code"
						onClick={() => {
							setShowGenerateHandshakeCodeModal(true)
						}}
					>
						Generate Code
					</Button>

					<Button
						variant=""
						className="w-md"
						title="Enter Code"
						onClick={() => setShowEnterHandshakeCodeModal(true)}
					>
						Enter Code
					</Button>

					{showGenerateHandshakeCodeModal && (
						<GenerateHandshakeCodeModal
							onClick={() =>
								setShowGenerateHandshakeCodeModal(false)
							}
						/>
					)}

					{showEnterHandshakeCodeModal && (
						<EnterHandshakeCodeModal
							onClick={() =>
								setShowEnterHandshakeCodeModal(false)
							}
						/>
					)}
				</div>
			</div>
		</WebSocketProvider>
	)
}

export default PairPage
