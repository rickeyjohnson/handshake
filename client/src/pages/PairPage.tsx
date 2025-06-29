import { Link } from 'react-router'
import { Button } from '../components/Button'
import { useState } from 'react'
import GenerateHandshakeCodeModal from '../components/GenerateHandshakeCodeModal'
import EnterHandshakeCodeModal from '../components/EnterHandshakeCodeModal'
import { generateHandshakeCode } from '../utils/utils'

const PairPage = () => {
	const [showGenerateHandshakeCodeModal, setShowGenerateHandshakeCodeModal] =
		useState(false)
	const [showEnterHandshakeCodeModal, setShowEnterHandshakeCodeModal] =
		useState(false)
    const [handshakeCode, setHandshakeCode] = useState('')

    const handleGenerateHandshakeCode = async () => {
        // 1. Look for if code for user has been generated
        //      a. if generated, check if expired
        //          I. if expired => free to generate new one, delete the old one
        //          II. if not expired => display current code
        //      b. if not generated => free to generate new one

        // 2. generate code
        // 3. set show to true

        try {
            const response = await fetch('/api/pair/generate_code') // this will return only valid codes or no codes
            const data = await response.json()

            if (!data.code) {   // if there is a code
                setHandshakeCode(data.code)
                return
            }

        } catch (error: any) {
            console.error(error.message)
            return
        }

        // if there's no code
        const code = generateHandshakeCode()
        
        try {
            await fetch('/api/pair/generate_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                })
            })

            setHandshakeCode(code)

        } catch (err: any) {
            console.error(err.message)
        }
    }

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
				<h1 className="text-center text-3xl">
					It's time to pair with your partner.
				</h1>

				<Button
					variant="clear"
					className="w-md"
					onClick={() => {
                        setHandshakeCode(generateHandshakeCode())
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
                        handshakeCode={handshakeCode}
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
