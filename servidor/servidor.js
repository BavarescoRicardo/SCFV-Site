const express = require('express');
const server = express();

// metodo responder ao na url
server.get('/', function(req, res) {
    res.send('<h1>Requisição get  -  Certo</h1>');
})

server.get('/usuarios', function(req, res) {
    res.sendFile(__dirname + "/arquivos/index.html");
//    res.send('<h1>Requisição get  - usuarios  -  Certo</h1>');
})

server.get('/sobre', function(req, res) {
    res.send('<h1>Requisição get - sobre  -  Certo</h1>');
})

server.get('/login/:user', function(req, res) {
    res.send("<h1>Tentativa de logar com o usuario:  " + req.params.user+"</h1>");
})


server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})