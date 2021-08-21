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


// Rotas
const chamadas = require('./rotas/chamadas') 
server.use('/chamada',chamadas)
const usuarios = require('./rotas/usuarios') 
server.use('/usuarios',usuarios)
const diarios = require('./rotas/diarios') 
server.use('/diarios',diarios)
const mapas = require('./rotas/mapas') 
server.use('/mapas',mapas)


// Segurança de sistemas
const seguranca = require('./rotas/rota_seguranca') 
server.use('/rota_seguranca',seguranca)


// constante caminho
const path = require("path")
server.use(express.static(path.join(__dirname, "public"))) 

const bodyParser = require('body-parser');

// Modelos
const Login = require('./models/Login')
const Mapa = require('./models/Mapa')
const MapaUsuario = require('./models/MapaUsuario')
const Usuario = require('./models/Usuario')

// Vetor de indices ids auxiliares
let inputValue = [];
var ult = 0;

// variavel cors para acessar servidores remotos
var cors = require('cors');
server.use(cors());


// Array de mensagens após login com erros ou usuario logado
// let Sem permissão = [];


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


server.get('/sobre', function(req, res) {
    res.render('horario')
})


server.post('/logar', function(req, res) {
    Login.findOne({ 
        where: {
            nome: req.body.user, senha: req.body.senha
        },
        raw : true 
    }).then(function (logdao) {
        user =>  res.json(logdao) 
        if(logdao.length === 0) throw error;        
        req.session.login = req.body.user;
        req.session.permissao = logdao.permissao;

        // Definir usuario e mensagem de login
//        'msg Sem permissão' =  req.body.user + "  :Nivel: " + logdao.permissao;

        res.redirect('/usuarios/usuariolista');
    }).catch(function(erro){
        req.session.login = null;
//        'msg Sem permissão' = "Usuario não encontrado";
        res.render('login_error', {msg: 'Sem permissão'});
    })
})

server.post('/cadastro', function(req, res) {             
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Login.create({
             codigo: 1,
             nome: req.body.user,
             senha: req.body.senha
         }).then(function(){            
            res.redirect('/usuarios/usuariolista');
         }).catch(function(erro){
            res.render('login_error');
         })
})

// Rota do servidor para criar novo diario de classe // postar conteudos
server.get('/quiz', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined || (!req.session.permissao > 0)) res.render('login_error');            
    res.render('Questionario')
})

server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})




// Trabalho Segurança de Sistemas
// Marcos e Ricardo
server.get('/ControleAcesso', function(req, res) {
    // Verifica se o usuario esta logado no sistema
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            

    // Autoriza qualquer usuario a visualizar a página sem verificar a permissão
    res.render('testeControleAcesso')
})