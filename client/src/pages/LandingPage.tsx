import { Link } from 'react-router'
import { Button } from '../components/ui/Button'
import Logo from '../components/Logo'
import ImageScroller from '../components/ImageScoller'

const LandingPage = () => {
	return (
		<>
			<div className="flex flex-col relative">
				<nav className="flex gap-6 not-sm:gap-0 absolute top-6 right-6 left-6 items-center flex-wrap">
					<Logo className="mr-auto" />
					<Link to="/login">
						<Button
							variant="ghost"
							className="flex gap"
							title="Log In"
						>
							Login
						</Button>
					</Link>

					<Link to="/signup">
						<Button
							className="flex gap-2 not-sm:hidden"
							title="Sign Up"
						>
							Sign Up
						</Button>
					</Link>
				</nav>

				<main className="flex justify-center items-center h-screen">
					<div className="flex flex-col gap-3 items-center text-center p-6">
						<h1 className="lg:text-7xl font-medium text-4xl">
							Welcome to Handshake
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
								</Button>
							</a>
						</section>
					</div>
				</main>

				<ImageScroller />
			</div>
		</>
	)
}

export default LandingPage
