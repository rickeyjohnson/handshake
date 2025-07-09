import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"

type WebSocketContextType = {
    socket: WebSocket | null 
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

const WebsocketProvider = ({children}: {children: React.ReactNode}) => {
    const socketRef = useRef<WebSocket | null>(null)
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/')
        socketRef.current = socket

        socket.onopen = () => {
			console.log('Websocket connected')
		}

		socket.onmessage = (event) => {
            console.log(event.data)
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