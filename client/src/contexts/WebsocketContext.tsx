import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { type Notification, type WebSocketContextType } from '../types/types'
import NotificationToast from '../components/NotificationToast'

export const WebSocketContext = createContext<WebSocketContextType>({
	socket: null,
})

export const WebSocketProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [notification, setNotification] = useState<Notification | null>({
		action: 'ADD',
		object: 'expense',
		user_id: '1',
		pair_id: '1',
		content: '$75 for trader joes',
	})

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
			const data = JSON.parse(e.data)
			setNotification(data)
		}

		return () => {
			ws.close()
		}
	}, [])

	return (
		<WebSocketContext.Provider value={{ socket }}>
			<NotificationToast notification={notification!} />
			{children}
		</WebSocketContext.Provider>
	)
}

export const useWebSocket = () => useContext(WebSocketContext)
