const express = require('express')
const server = express()

// metodo para responder ao entrar na url
server.get('/', (req, res) => {
    res.send('<h1> Resposde Home para apenas /</h1>')
})

server.listen(3001, () => {
    console.log('Endereço para acessar eh http://localhost:3001')
})