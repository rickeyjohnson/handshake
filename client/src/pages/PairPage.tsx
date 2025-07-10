import { Link, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { useEffect, useState } from 'react'
import GenerateHandshakeCodeModal from '../components/GenerateHandshakeCodeModal'
import EnterHandshakeCodeModal from '../components/EnterHandshakeCodeModal'
import { useUser } from '../contexts/UserContext'

const PairPage = () => {
	const [showGenerateHandshakeCodeModal, setShowGenerateHandshakeCodeModal] =
		useState(false)
	const [showEnterHandshakeCodeModal, setShowEnterHandshakeCodeModal] =
		useState(false)
	const { user } = useUser()
	const navigate = useNavigate()

	useEffect(() => {
		if (user?.is_paired) {
			navigate('/dashboard')
			return
		}
	}, [])

	return (
		<div className="flex justify-center items-center h-screen relative">
			<Link to="/login" className="absolute left-5 top-5">
				<Button
					variant="ghost"
					className="flex justify-center items-center"
				>
					<span className="material-icons">arrow_back</span>
				</Button>
			</Link>

			<div className="flex flex-col justify-center items-center gap-4 w-md relative">
				<h1 className="text-center text-3xl capitalize">
					{user?.name} it's time to pair with your partner.
				</h1>

				<Button
					variant="clear"
					className="w-md"
					onClick={() => {
						setShowGenerateHandshakeCodeModal(true)
					}}
				>
					Generate Code
				</Button>

				<Button
					variant=""
					className="w-md"
					onClick={() => setShowEnterHandshakeCodeModal(true)}
				>
					Enter Code
				</Button>

				{showGenerateHandshakeCodeModal && (
					<GenerateHandshakeCodeModal
						onClick={() => setShowGenerateHandshakeCodeModal(false)}
					/>
				)}

				{showEnterHandshakeCodeModal && (
					<EnterHandshakeCodeModal
						onClick={() => setShowEnterHandshakeCodeModal(false)}
					/>
				)}
			</div>
		</div>
	)
}

export default PairPage
