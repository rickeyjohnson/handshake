import {
	IconDashboard,
	IconDotsVertical,
	IconMoneybag,
	IconTable,
	IconTargetArrow,
	type Icon,
} from '@tabler/icons-react'
import { LogoutButton } from './LogoutButton'
import { Button } from './Button'
import { useLocation, useNavigate } from 'react-router'
import { useUser } from '../contexts/UserContext'

type navItem = {
	title: string
	url: string
	icon: Icon
}

const Sidebar = () => {
	const { user } = useUser()
	const location = useLocation()
	const naviagte = useNavigate()
	const nav: navItem[] = [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: IconDashboard,
		},
		{
			title: 'Transactions',
			url: '/transactions',
			icon: IconTable,
		},
		{
			title: 'Budget',
			url: '/budgets',
			icon: IconMoneybag,
		},
		{
			title: 'Goals',
			url: '/goals',
			icon: IconTargetArrow,
		},
	]
	const selectedStyle = (url: string) => {
		if (location.pathname.includes(url)) {
			return 'bg-slate-950 text-white font-medium'
		}

		return 'hover:bg-stone-200/40'
	}

	return (
		<nav className="overflow-y-scroll sticky top-4 h-[calc(100dvh-2rem)] flex flex-col">
			<div className="grow-1">
				<h1 className="text-lg font-medium px-2 py-2 border-b-1 border-b-stone-300 mb-2">
					Handshake
				</h1>

				{nav.map((item) => {
					return (
						<Button
							variant="dashboard"
							className={`my-1 ${selectedStyle(item.url)}`}
							onClick={() => naviagte(item.url)}
							key={item.title}
						>
							<item.icon size={18} />
							{item.title}
						</Button>
					)
				})}
			</div>

			<div className="">
				<LogoutButton className="hover:bg-stone-200/40 my-1" />
				<div
					className={`flex gap-2.5 items-center w-full hover:bg-stone-200/50 p-2 rounded-lg relative`}
				>
					<img
						className="h-9 w-9 object-cover rounded-xl"
						src="https://braverplayers.org/wp-content/uploads/2022/09/blank-pfp.png"
					/>
					<div className="flex flex-col gap">
						<h1 className="font-medium text-sm capitalize">
							{user?.name || 'John Doe'}
						</h1>
						<p className="text-gray-500 text-xs">
							{user?.email || 'johndoe@example.com'}
						</p>
					</div>
					<IconDotsVertical className="ml-auto" size={16} />
				</div>
			</div>
		</nav>
	)
}

export default Sidebar
