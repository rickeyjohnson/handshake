import { useNavigate } from 'react-router'

const Logo = ({ className }: {className?: string}) => {
	const navigate = useNavigate()

	return (
		<button
			className={`text-2xl font-medium ${className}`}
			onClick={() => navigate('/')}
		>
			Handshake
		</button>
	)
}

export default Logo
