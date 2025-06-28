import { Link } from 'react-router'
import { Button } from '../components/Button'

const PairPage = () => {
	return (
		<div className="flex flex-col gap-8 h-screen w-screen justify-center items-center relative">
			<Link to="/login" className="absolute left-5 top-5">
				<Button
					variant="ghost"
					className="flex justify-center items-center"
				>
					<span className="material-icons">arrow_back</span>
				</Button>
			</Link>

			<h1 className="text-center text-3xl">
				It's time to pair with your partner.
			</h1>

			<div className="flex gap-10">
				<Button variant="clear">Generate Code</Button>

				<Button variant="clear">Enter Code</Button>
			</div>
		</div>
	)
}

export default PairPage
