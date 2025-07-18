import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { type Notification, type WebSocketContextType } from '../types/types'
import NotificationToast from '../components/NotificationToast'
import { useUser } from './UserContext'

export const WebSocketContext = createContext<WebSocketContextType>({
	socket: null,
})

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [notification, setNotification] = useState<Notification | null>(null)
	const { user } = useUser()

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:3000/')
		setSocket(ws)

		ws.onopen = () => {
			console.log('Websocket connected')
		}

		ws.close = () => {
			console.log('Websocket disconnected')
		}

		ws.onerror = (err) => {
			console.error('WebSocket error:', err)
		}

		ws.onmessage = (e) => {
			if (user) {
				const data = JSON.parse(e.data)
				setNotification(data)
			} else {
				setNotification(null)
			}
		}

		return () => {
			ws.close()
		}
	}, [user])

	return (
		<WebSocketContext.Provider value={{ socket }}>
			{notification && (
				<NotificationToast
					notification={notification}
					onHide={() => setNotification(null)}
				/>
			)}
			{children}
		</WebSocketContext.Provider>
	)
}

export const useWebSocket = () => useContext(WebSocketContext)
