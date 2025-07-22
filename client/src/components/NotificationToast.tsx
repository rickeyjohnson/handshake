import {
	IconBellRingingFilled,
	IconCircleCheck,
	IconCircleXFilled,
	IconMoneybag,
	IconTargetArrow,
} from '@tabler/icons-react'
import type { Notification } from '../types/types'
import { useUser } from '../contexts/UserContext'
import { useEffect, useState } from 'react'

const NotificationToast = ({
	notification,
	onHide,
}: {
	notification: Notification
	onHide: () => void
}) => {
	const NOTIFICATION_TIMER = 1000 * 10
	const { user } = useUser()
	const [show, setShow] = useState(false)
	const [success, setSuccess] = useState(false)

	const actionToVerb = {
		ADD: 'created',
		UPDATE: 'modified',
		DELETE: 'deleted',
	}

	const displayIcon = (obj: string) => {
		switch (obj) {
			case 'expense':
				return <IconBellRingingFilled size={20} className="mt-0.5" />
			case 'goal':
				return <IconTargetArrow size={20} className="mt-0.5" />
			case 'budget':
				return <IconMoneybag size={20} className="mt-0.5" />
		}
	}

	useEffect(() => {
		if (notification) {
			setShow(true)

			if (!notification.action.includes('FAILED')) {
				setSuccess(true)
			}

			const hideTimer = setTimeout(() => {
				setShow(false)
				// Give time for animation to finish before unmounting
				setTimeout(() => onHide(), 500)
			}, NOTIFICATION_TIMER)

			return () => clearTimeout(hideTimer)
		}
	}, [notification, onHide])

	if (!notification) return null

	return (
		<div
			className={`flex justify-center col-span-full gap-2 rounded-2xl w-fit bg-white fixed right-3 top-3 py-3 px-8 border border-stone-200 z-99 transform transition-all duration-500 ease-in-out ${
				show ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
			}`}
		>
			{notification.user_id === user?.id ? (
				success ? (
					<>
						<IconCircleCheck size={20} className="mt-0.5" />
						<div>
							<h1 className="font-medium text-md">
								Success! Your changes have been saved.
							</h1>
							<p className="font-light text-stone-400 text-sm">
								<span className="capitalize">
									{user.partner.name}
								</span>{' '}
								will be notified of your changes.
							</p>
						</div>
					</>
				) : (
					<>
						<IconCircleXFilled
							size={20}
							className="mt-0.5"
							color="red"
						/>
						<div>
							<h1 className="font-medium text-md text-red-600">
								Error! Your changes could not be saved.
							</h1>
							<p className="font-light text-red-400 text-sm">
								<span className="capitalize">
									{user.partner.name}
								</span>{' '}
								will not be notified until your changes are
								saved successfully. Please refresh your page to
								see updates.
							</p>
						</div>
					</>
				)
			) : (
				<>
					{displayIcon(notification.object)}
					<div>
						<h1 className="capitalize font-medium text-md">{`${
							notification.action === 'ADD' ? 'New' : ''
						} ${notification.object} ${
							actionToVerb[notification.action]
						}!`}</h1>
						<p className="font-light text-stone-400 text-sm">
							<span className="capitalize">
								{user ? user.partner.name : 'Your partner'}
							</span>{' '}
							{actionToVerb[notification.action]}{' '}
							{notification.object === 'expense' ? 'an' : 'a'}{' '}
							{notification.object}:{' '}
							<span className="font-semibold text-stone-500">
								{notification.content}
							</span>
						</p>
						<p className="font-light text-stone-400 text-sm">
							Check it out in your shared{' '}
							<span className="capitalize">
								{notification.object === 'expense'
									? 'transactions'
									: `${notification.object}s`}
							</span>{' '}
							tab
						</p>
					</div>
				</>
			)}
		</div>
	)
}

export default NotificationToast
