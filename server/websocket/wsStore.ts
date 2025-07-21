type Clients = {
    ws: WebSocket
    user: {
        id: String
        pair_id: String
    }
}

export const connectedClients: Clients[] = []
