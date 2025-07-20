import { useNavigate } from 'react-router'

const Logo = () => {
	const navigate = useNavigate()

	return (
		<button
			className="text-2xl font-medium absolute top-4 left-4"
			onClick={() => navigate('/')}
		>
			Handshake
		</button>
	)
}

export default Logo
