import { Link } from 'react-router'
import Button from '../components/Button'

const LandingPage = () => {
	return (
		<div>
			<h1 className="text-4xl">Welcome, to Handshake</h1>
			<p>The modern finance app designed for couples</p>

			<Link to="/signup">
				<Button className="bg-slate-800 px-4 py-2 rounded-md text-white">
					Get Started
				</Button>
			</Link>
		</div>
	)
}

export default LandingPage
