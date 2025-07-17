import { IconBellRingingFilled, IconCircleCheck, IconMoneybag, IconTargetArrow } from '@tabler/icons-react'
import type { Notification } from '../types/types'
import { useUser } from '../contexts/UserContext'

const NotificationToast = ({
	notification,
}: {
	notification: Notification
}) => {
	const { user } = useUser()

	const actionToVerb = {
		ADD: 'created',
		UPDATE: 'modified',
		DELETE: 'deleted',
	}

  const displayIcon = (obj: string) => {
    switch (obj) {
      case 'expense':
        return <IconBellRingingFilled size={20} className="mt-0.5"/>
      case 'goal':
        return <IconTargetArrow size={20} className="mt-0.5"/>
      case 'budget':
        return <IconMoneybag size={20} className="mt-0.5"/>
    }
  }

	return (
		<div className="flex justify-center col-span-full gap-2 rounded-2xl w-fit bg-white fixed right-3 top-3 py-3 px-8 border-1 border-stone-200">
			{notification.user_id === user?.id ? (
        <>
        <IconCircleCheck size={20} className="mt-0.5" />
				<div>
					<h1 className="font-medium text-md">
						Success! Your chnages have been saved.
					</h1>
					<p className="font-light text-stone-400 text-sm">
						<span className="capitalize">{user.partner.name}</span>{' '}
						will be notified of your changes.
					</p>
				</div>
        </>
			) : (
        <>
        {displayIcon(notification.object)}
				<div>
					<h1 className="capitalize font-medium text-md">{`${
						notification.action === 'ADD' && 'New'
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
