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
const Contato = require('./models/Contato')
const Presenca = require('./models/Presenca')
const UsuarioPresenca = require('./models/UsuarioPresenca')

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

server.post('/logar', function(req, res) {
    Login.findAll({ 
        where: {
            nome: req.body.user, senha: req.body.senha
        },
        raw : true // <----------- Magic is here
    }).then(function (sensors) {   
        notes => res.json(notes)     
//        if(notes) throw error;
        // console.log(sensors)
        res.send("<h1>Usuario-  " + req.body.user + " - login okei </h1>")
    }).catch(function(erro){
        res.send("<h1>Algo errado no login:  " + req.body.user + "</h1>")
    })
})

server.get('/apagar/:user', function(req, res) {    
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
            turno: req.body.cmbTurno,
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

server.get('/darpresenca', function(req, res) {
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('presenca', {posts: posts})
    })
    
})

server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})