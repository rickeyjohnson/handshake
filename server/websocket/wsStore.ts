type Clients = {
    ws: WebSocket
    user: {
        id: String
        pair_id: String
    } | null
}

export const connectedClients: Clients[] = []
