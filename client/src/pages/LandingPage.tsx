import { Link } from 'react-router'
import { Button } from '../components/ui/Button'
import Logo from '../components/Logo'

const LandingPage = () => {
	return (
		<>
			<div className="flex flex-col h-screen relative">
				<Logo />
				<nav className="flex justify-end gap-6 absolute right-6 top-6">
					<Link to="/login">
						<Button
							variant="ghost"
							className="flex gap"
							title="Log In"
						>
							Login
							<span className="material-icons pl-1.5">
								arrow_right_alt
							</span>
						</Button>
					</Link>

					<Link to="/signup">
						<Button className="flex gap-2" title="Sign Up">
							Sign Up
						</Button>
					</Link>
				</nav>

				<main className="flex justify-center items-center h-full">
					<div className="flex flex-col gap-3 items-center text-center p-6">
						<h1 className="lg:text-7xl font-medium text-4xl">
							Welcome, to Handshake
						</h1>
						<p className="text-xl">
							The modern finance app designed for couples
						</p>

						<section className="flex gap-6 justify-center">
							<Link to="/signup">
								<Button title="Get Started">Get Started</Button>
							</Link>
							<a
								href="https://github.com/rickeyjohnson/handshake/"
								target="_blank"
							>
								<Button
									className="flex items-center"
									variant="ghost"
									title="Github"
								>
									Github
									<span className="material-icons pl-1.5">
										arrow_right_alt
									</span>
								</Button>
							</a>
						</section>
					</div>
				</main>

				<p className="text-center pb-3 font-medium">More coming ...</p>
			</div>
		</>
	)
}

export default LandingPage
