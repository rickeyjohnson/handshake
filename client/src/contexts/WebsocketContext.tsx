import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { WebSocketContextType } from '../types/types'
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
			console.log(data)
		}

		return () => {
			ws.close()
		}
	}, [])

	return (
		<WebSocketContext.Provider value={{ socket }}>
			<NotificationToast />
			{children}
		</WebSocketContext.Provider>
	)
}

export const useWebSocket = () => useContext(WebSocketContext)
