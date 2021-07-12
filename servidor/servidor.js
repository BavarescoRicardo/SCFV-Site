const express = require('express');
const server = express();
const handlebars = require('express-handlebars')
// constante caminho
const path = require("path")
server.use(express.static(path.join(__dirname, "public"))) 

const bodyParser = require('body-parser');
const Usuario = require('./models/Usuario')
const Escola = require('./models/Escola')
const Login = require('./models/Login')

// variavel cors para acessar servidores remotos
var cors = require('cors');
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
    // res.send('<h1>Requisição get  -  Certo</h1>');    
    res.render('login')
})

server.get('/cadastrousuario', function(req, res) {
    // res.send('<h1>Requisição get  -  Certo</h1>');    
    res.render('cadastrousuario')
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
    Usuario.destroy({where: {'id' : req.params.id}}).then(function(){
        console.log("Registro apagado com sucessor");
    }).catch(function(erro){
        console.log("Item nao encontrado "+ erro)
    })
})

server.post('/cadastro', function(req, res) {             
    Login.create({
             codigo: 1,
             nome: req.body.user,
             senha: req.body.senha
         }).then(function(){
//            res.send("<h1>Tentativa de cadastrar usuario o usuario-  " + req.body.user + " - pelo login" + "</h1>")
            res.redirect('/usuariolista');
         }).catch(function(erro){
             res.send("Ocorreu um erro " + erro)
         })
})

server.post('/cadastrousuario', function(req, res) {             
    Usuario.create({            
             // Cadastro novo usuario
             codigo: 1,
            nome: req.body.nome,
            turno: 1,
            bairro: req.body.bairro,
            datanasc: req.body.nasc,
            turma: req.body.turma,
            idescola: req.body.cmbEscola            
         }).then(function(){
            res.redirect('/usuariolista');
         }).catch(function(erro){
             res.send("Ocorreu um erro " + erro)
         })
})


server.get('/usuariolista', function(req, res) {
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('listausuarios', {posts: posts})
    })
    
})

server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})