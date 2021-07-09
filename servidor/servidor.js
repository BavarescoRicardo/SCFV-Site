const express = require('express');
const server = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser');

// variavel cors para acessar servidores remotos
var cors = require('cors')
server.use(cors());

// Configurar
    //Template
    server.engine('handlebars', handlebars({defaultLayout: 'main'}))
    server.set('view engine', 'handlebars')

    // body-parser para pegar os inputs de um formulario do tipo post    
    server.use(bodyParser.urlencoded({extended: false}))
    server.use(bodyParser.json())

//  Definir rotas

// metodo responder ao na url
server.get('/', function(req, res) {
    //res.send('<h1>Requisição get  -  Certo</h1>');
    res.render('formulario')
})

        // server.get('/usuarios', function(req, res) {
        //     res.sendFile(__dirname + "/arquivos/index.html");
        // //    res.send('<h1>Requisição get  - usuarios  -  Certo</h1>');
        // })

server.get('/sobre', function(req, res) {
    res.send('<h1>Requisição get - sobre  -  Certo</h1>');
})

server.get('/login/:user', function(req, res) {
    res.send("<h1>Tentativa de logar com o usuario:  " + req.params.user+"</h1>");
})

server.post('/cadastro', function(req, res) {
    res.send("<h1>Tentativa de cadastrar usuario o usuario-  " + req.body.user + " - pelo formulario" + "</h1>");
})


server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})