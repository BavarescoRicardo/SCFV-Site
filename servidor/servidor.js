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

// Vetor de indices ids auxiliares
let inputValue = [];
var ult = 0;

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

        // server.get('/usuarios', function(req, res) {
        //     res.sendFile(__dirname + "/arquivos/index.html");
        // //    res.send('<h1>Requisição get  - usuarios  -  Certo</h1>');
        // })

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
        req.session.login = req.body.user
        req.session.permissao = logdao.permissao

        res.redirect('/usuarios/usuariolista');
    }).catch(function(erro){
        req.session.login = null
        res.render('login_error');
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
server.get('/diariocnteudo', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined || (!req.session.permissao > 0)) res.render('login_error');            
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
        Diaria.findAll({order: [['dia', 'DESC']]}).then(function(posts){
            res.render('listaDiaria', {posts: posts})
        })
    }).catch(function(erro){
        res.send("Ocorreu um erro " + erro)
    })
})

// Lista os diarios de classe já cadastrados
server.get('/listardiario', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined || (!req.session.permissao > 0) ) res.render('login_error');            
    Diaria.findAll({        
        attributes: [
            'id',
            'conteudo',
            'turma',
            'turno',
            [Diaria.sequelize.fn('date_format', Diaria.sequelize.col('dia'), '%d/%m/%Y'), 'dia_formed']
        ],
        order: [['dia', 'DESC'], ['turno', 'ASC']]
    })
        .then(function(posts){
        res.render('listaDiaria', {posts: posts})
    })    
})

server.listen(8081, function() {
    console.log('Aceeso em: http://localhost:8081');
})