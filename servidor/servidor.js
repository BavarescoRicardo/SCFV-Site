const express = require('express');
const server = express();
const handlebars = require('express-handlebars')
// Sessao
const session = require("express-session")
const flash = require("connect-flash")
//Configurar sessao
server.use(session({
    secret: "scfvpacai",
    resave: true,
    saveUninitialized: true
}))
server.use(flash())

        // // Middleware
        // server.use((req, res, next) => {
        //     res.locals.success_msg = req.flash("success_msg")
        //     res.locals.error_msg = req.flash("error_msg")
        // })

// constante caminho
const path = require("path")
server.use(express.static(path.join(__dirname, "public"))) 

const bodyParser = require('body-parser');

// Modelos
const Usuario = require('./models/Usuario')
const Escola = require('./models/Escola')
const Login = require('./models/Login')
const Contato = require('./models/Contato')
const Diaria = require('./models/Diaria')
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
        raw : true 
    }).then(function (sensors) {
        user =>  res.json(sensors) 
        if(sensors.length === 0) throw error;
        console.log(sensors.length === 0); // false
        console.log(sensors)
//        alert('okei')
        res.redirect('/usuariolista');
    }).catch(function(erro){
//        alert('erro')
        res.render('login_error');
    })
})

server.get('/deletar/:user', function(req, res) {        
    Usuario.destroy({where: {'id' : req.params.user}}).then(function(){
        res.send("<h1>Tentativa de apagar o usuario:  " + req.params.user+"</h1>");
        console.log("Registro apagado com sucessor");
    }).catch(function(erro){
        console.log("Item nao encontrado " +req.params.user + " " + erro)
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

// Rota do servidor para criar novo diario de classe // postar conteudos

server.get('/diariocnteudo', function(req, res) {
    // res.send('<h1>Requisição get  -  Certo</h1>');    
    res.render('diaria')
})


server.post('/novodiario', function(req, res) {
    Diaria.create({            
        // Cadastro novo usuario
       codigo: 1,
       dia: req.body.diaoficina,
       turma: req.body.cmbTurma,
       oficina: req.body.cmbOficina,
       turno: req.body.cmbTurno,
       conteudo: req.body.conteudo,
       observacao: req.body.obs
    }).then(function(){
//       res.redirect('/usuariolista');
        Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('listausuarios', {posts: posts})
        })
    }).catch(function(erro){
        res.send("Ocorreu um erro " + erro)
    })
})

server.post('/novachamada', function(req, res) {
    Presenca.create({            
        // Cadastro novo usuario
       codigo: 1,
       dia: req.body.diaoficina,
       turma: req.body.cmbTurma,
       oficina: req.body.cmbOficina,
       turno: req.body.cmbTurno
    }).then(function(posts){
        Usuario.findAll({ 
            where: {
                turma: req.body.cmbTurma
            },
            raw : true })
        res.render('presencaUsuarios', {posts: posts});        
    }).catch(function(erro){
        res.send("Ocorreu um erro " + erro)
    })
})

server.post('/darpresenca', function(req, res) {
    Presenca.create({            
        // Cadastro novo usuario
       codigo: 1,
       dia: req.body.diaoficina,
       turma: req.body.cmbTurma,
       oficina: req.body.cmbOficina,
       turno: req.body.cmbTurno
    }).then(function(){
//       res.redirect('/usuariolista');
    }).catch(function(erro){
        res.send("Ocorreu um erro " + erro)
    })
    
})

server.get('/listapresenca', function(req, res) {
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('presenca', {posts: posts})
    })
    
})

server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})