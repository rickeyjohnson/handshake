import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
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
	const backoffRef = useRef<number>(1)
	const retryTimeoutRef = useRef<any>(null)

	useEffect(() => {
		const connect = () => {
			const ws = new WebSocket('ws://localhost:3000/')
			setSocket(ws)

			ws.onopen = () => {
				backoffRef.current = 1
				console.log('Websocket connected')
			}

			ws.onclose = () => {
				const delay = Math.pow(2, backoffRef.current) * 1000
				console.warn(
					`'Websocket closed, will retry soon in ${delay / 1000}s.`
				)
				backoffRef.current += 1
				retryTimeoutRef.current = setTimeout(connect, delay)
			}

			ws.onerror = (err) => {
				console.error('WebSocket error:', err)
				ws.close()
			}

			ws.onmessage = (e) => {
				if (user) {
					const data = JSON.parse(e.data)
					setNotification(data)
				} else {
					setNotification(null)
				}
			}
		}

		connect()

		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current)
			}

			if (socket) {
				socket.close()
			}
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
