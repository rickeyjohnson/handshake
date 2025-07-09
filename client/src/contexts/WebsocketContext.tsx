import type React from "react"
import { createContext, useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router"

type WebSocketContextType = {
    socket: WebSocket | null 
}

export const WebSocketContext = createContext<WebSocketContextType>({socket: null})

export const WebSocketProvider = ({children}: {children: React.ReactNode}) => {
    const socketRef = useRef<WebSocket | null>(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/')
        socketRef.current = socket

        socket.onopen = () => {
			console.log('Websocket connected')
		}

		socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                switch (data.type) {
                    case 'paired':
                        navigate('/dashboard')
                        break
                    
                    default:
                        console.warn('Unhandled websocket message', data)
                }
            } catch (error) {
                console.error(error)
            }
		}

        socket.close = () => {
            console.log('Websocket disconnected')
        }

        socket.onerror = (err) => {
			console.error('WebSocket error:', err)
		}

		return () => {
			socket.close()
		}
    }, [])

    return (
        <WebSocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => useContext(WebSocketContext)