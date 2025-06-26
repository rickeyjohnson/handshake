import { Link } from 'react-router'
import Button from '../components/Button'

const LandingPage = () => {
	return (
		<>
			<nav>

			</nav>

			<main className='flex justify-center items-center h-screen'>
				<div className='flex flex-col gap-3 items-center'>
					<h1 className="text-8xl font-medium">Welcome, to Handshake</h1>
					<p className='text-2xl'>The modern finance app designed for couples</p>
					
					<section className='flex gap-10 justify-center'>
						<Link to="/signup">
							<Button>Get Started</Button>
						</Link>
						<a href='https://github.com/rickeyjohnson/handshake/' target='_blank'><Button variant='ghost'>Github</Button></a>
					</section>
				</div>
			</main>
		</>
	)
}

export default LandingPage
