from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        # Store connections by stream_id
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, stream_id: str):
        await websocket.accept()
        if stream_id not in self.active_connections:
            self.active_connections[stream_id] = []
        self.active_connections[stream_id].append(websocket)
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "system",
            "message": "Connected to chat",
            "stream_id": stream_id
        }))
    
    def disconnect(self, websocket: WebSocket, stream_id: str):
        if stream_id in self.active_connections:
            if websocket in self.active_connections[stream_id]:
                self.active_connections[stream_id].remove(websocket)
            
            # Clean up empty stream connections
            if not self.active_connections[stream_id]:
                del self.active_connections[stream_id]
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast_to_stream(self, stream_id: str, message: dict):
        if stream_id in self.active_connections:
            # Send to all connected clients in this stream
            disconnected_clients = []
            for connection in self.active_connections[stream_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    # Connection is dead, mark for removal
                    disconnected_clients.append(connection)
            
            # Remove dead connections
            for connection in disconnected_clients:
                self.disconnect(connection, stream_id)
    
    async def get_stream_viewer_count(self, stream_id: str) -> int:
        return len(self.active_connections.get(stream_id, []))