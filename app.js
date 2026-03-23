const express = require('express')
const { createServer } = require('http')
const { v4: uuidv4 } = require('uuid')
const WebSocket = require('ws')

const app = express()
const server = createServer(app)
const port = process.env.PORT || 10000

const clients = new Map()

const wss = new WebSocket.Server({ server, path: '/ws' })

function kick(id) {
    const client = clients.get(id)
    if (!client) return false
    client.ws.close()
    clients.delete(id)
    return true
}

app.get('/', (req, res) => {
    res.send('examsock ws server at /ws!')
})

wss.on('connection', (ws) => {
    const id = uuidv4()
    clients.set(id, { ws, role: "stu" })

    ws.send(id)

    ws.on('message', (message) => {
        const msg = message.toString()
        const client = clients.get(id)

        if (msg === "whoami") {
            ws.send(id)
        } else if (msg.startsWith("discon:")) {
            const targetId = msg.split(":")[1]
            if (kick(targetId)) {
                ws.send("suc:discon:")
            } else {
                ws.send("err:discon:clientnotfound")
            }
        } else if (msg === "promo") {
            if (client.role === "tea") {
                ws.send("err:promo:alreadyteacher")
            } else {
                client.role = "tea"
                ws.send("suc:promo")
            }
        }
    })

    ws.on('close', () => {
        clients.delete(id)
    })
})

server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})
