import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

type WebSocketContextType = {
	socket: WebSocket | null
}

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

		return () => {
			ws.close()
		}
	}, [])

	return (
		<WebSocketContext.Provider value={{ socket }}>
			{children}
		</WebSocketContext.Provider>
	)
}

export const useWebSocket = () => useContext(WebSocketContext)
