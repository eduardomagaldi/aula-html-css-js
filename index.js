const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5001
const { Server } = require('ws')

const server = express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/galera', (req, res) => res.render('pages/galera'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

const wss = new Server({ server })

wss.on('connection', (ws) => {
    // console.log('Client connected', ws)

    ws.on('message', (data) => {
        if (wss.clients.size) {
            wss.clients.forEach((client, i) => {
                client.send(data)
            })
        }
    })

    ws.on('error', (error) => {
        console.log('error', error)
    })

    ws.on('close', () => console.log('Client disconnected'))
})

// setInterval(() => {
//     wss.clients.forEach((client) => {
//         client.send(new Date().toTimeString())
//     })
// }, 1000)
