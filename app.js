const express = require('express')
const { createServer } = require('http')
import { v4 as uuidv4 } from 'uuid';

const WebSocket = require('ws')

const app = express()
const server = createServer(app)
const port = process.env.PORT || 10000

// Serves WebSocket connections at /ws (any path is fine)
const wss = new WebSocket.Server({ server, path: '/ws' })

// HTTP routes
app.get('/', (req, res) => {
  res.send('ExamSock WS Server at /ws!')
})

// WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected')

  ws.on('message', (message) => {
    msg = message.toString()
    console.log('Received:', message.toString())
    if (msg == "ping") {
      ws.send("pong")
    } else if (msg == "register") {
      ws.send("client registered: 
    }
  })
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
