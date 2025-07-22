type ConnectedClient = {
	ws: WebSocket
	user_id: string | null
	pair_id: string | null
}

export const connectedClients: ConnectedClient[] = []
