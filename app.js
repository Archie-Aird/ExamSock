const express = require('express')
const { createServer } = require('http')
const { v4: uuidv4 } = require('uuid');

const WebSocket = require('ws')

const app = express()
const server = createServer(app)
const port = process.env.PORT || 10000
const clients = new Map()

// Serves WebSocket connections at /ws (any path is fine)
const wss = new WebSocket.Server({ server, path: '/ws' })

function kick(id) {
  ws = clients.get(id)
  if (!ws) {
    return false
  }
  ws.close()
}

// HTTP routes
app.get('/', (req, res) => {
  res.send('ExamSock WS Server at /ws!')
})

// WebSocket connections
wss.on('connection', (ws) => {
  id = uuidv4()
  console.log('WebSocket client connected: ' + id)
  ws.send(id)
  clients.set(id,ws)
  ws.on('message', (message) => {
    msg = message.toString()
    console.log('Received:', message.toString())
    if (msg == "whoami") {
      ws.send(id)
    } else if (msg.startsWith("discon:")) {
      id = msg.split(":")[1]
      if (kick(id)) {
        ws.send("SUC:DISCON:")
      } else {
        ws.send("ERR:DISCON:CLIENTNOTFOUND")
      }
    }
  })
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
