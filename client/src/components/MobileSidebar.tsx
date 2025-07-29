import { useNavigate } from 'react-router'
import { nav } from '../constants/constants'
import { Button } from './ui/Button'
import { LogoutButton } from './LogoutButton'

const MobileSidebar = () => {
	const navigate = useNavigate()

	const selectedStyle = (url: string) => {
		if (location.pathname.includes(url)) {
			return 'bg-slate-950 text-white font-medium'
		}

		return 'hover:bg-stone-200/40'
	}

	return (
		<nav className="fixed bottom-0 left-0 w-screen bg-white border-t border-gray-200 flex justify-around items-center p-2 z-50 overflow-x-auto gap-1">
			{nav.map((item) => {
				return (
					<Button
						variant="dashboard"
						className={`flex flex-col ${selectedStyle(item.url)} min-w-25`}
						onClick={() => navigate(item.url)}
						key={item.title}
					>
						<item.icon size={18} />
						{item.title}
					</Button>
				)
			})}

			<LogoutButton className="hover:bg-stone-200/40 flex flex-col min-w-25" />
		</nav>
	)
}

export default MobileSidebar
