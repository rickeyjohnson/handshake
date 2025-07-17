import { IconCircleCheck } from '@tabler/icons-react'
import type { Notification } from '../types/types'
import { useUser } from '../contexts/UserContext'

const NotificationToast = ({
	notification,
}: {
	notification: Notification
}) => {
	const { user } = useUser()

  const actionToVerb = {
    'ADD': 'created',
    'UPDATE': 'modified',
    'DELETE': 'deleted'
  }

	return (
		<div className="flex justify-center col-span-full gap-2 rounded-2xl w-fit bg-white fixed right-3 top-3 py-3 px-8 border-1 border-stone-200">
			<IconCircleCheck size={20} className="mt-0.5" />
			{notification.user_id === user?.id ? (
				<div>
					<h1 className="font-medium text-md">
						Success! Your chnages have been saved.
					</h1>
					<p className="font-light text-stone-400 text-sm">
						<span className="capitalize">{user.partner.name}</span>{' '}
						will be notified of your changes.
					</p>
				</div>
			) : (
				<div>
          <h1 className='capitalize font-medium text-md'>{`${notification.action === 'ADD' && 'New'} ${notification.object} ${actionToVerb[notification.action]}`}</h1>
          <p className="font-light text-stone-400 text-sm">
						<span className="capitalize">{user ? user.partner.name : 'Your partner'}</span>{' '}
            just {actionToVerb[notification.action]} {notification.object === 'expense' ? 'an' : 'a'} {notification.object}: <span className='font-semibold'>{notification.content}</span>
					</p>
          <p className='font-light text-stone-400 text-sm'>Check it out in your shared <span className='capitalize'>{notification.object === 'expense' ? 'transactions' : `${notification.object}s`}</span> tab</p>
        </div>
			)}
		</div>
	)
}

export default NotificationToast
