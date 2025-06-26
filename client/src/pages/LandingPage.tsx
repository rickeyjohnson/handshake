import { Link } from 'react-router'
import Button from '../components/Button'

const LandingPage = () => {
	return (
		<>
			<div className='flex flex-col h-screen relative'>
				<nav className='flex justify-end gap-6 absolute right-6 top-6'>
					<Link to="/login">
						<Button variant='ghost' className='flex gap'>Login<span className="material-icons pl-1.5">arrow_right_alt</span></Button>
					</Link>
				
					<Link to="/signup">
						<Button className='flex gap-2'>Sign Up</Button>
					</Link>
				</nav>
				
				<main className='flex justify-center items-center h-full'>
					<div className='flex flex-col gap-3 items-center'>
						<h1 className="text-7xl font-medium">Welcome, to Handshake</h1>
						<p className='text-xl'>The modern finance app designed for couples</p>
						
						<section className='flex gap-6 justify-center'>
							<Link to="/signup">
								<Button>Get Started</Button>
							</Link>
							<a href='https://github.com/rickeyjohnson/handshake/' target='_blank'><Button className="flex items-center" variant='ghost'>Github<span className="material-icons pl-1.5">arrow_right_alt</span></Button></a>
						</section>
					</div>
				</main>

				<p className='text-center pb-3 font-medium'>More coming ...</p>
			</div>
		</>
	)
}

export default LandingPage
