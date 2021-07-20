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

server.get('/cadastrousuario', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
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
        req.session.login = req.body.user

        res.redirect('/usuariolista');
    }).catch(function(erro){
        req.session.login = null
        res.render('login_error');
    })
})

server.get('/deletar/:user', function(req, res) {        
    Usuario.destroy({where: {'id' : req.params.user}}).then(function(){
        res.redirect('/usuariolista');
    }).catch(function(erro){
        console.log("Item nao encontrado " +req.params.user + " " + erro)
    })
})

server.post('/cadastro', function(req, res) {             
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Login.create({
             codigo: 1,
             nome: req.body.user,
             senha: req.body.senha
         }).then(function(){            
            res.redirect('/usuariolista');
         }).catch(function(erro){
            res.render('login_error');
         })
})

server.post('/cadastrousuario', function(req, res) {             
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
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
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('listausuarios', {posts: posts})
    })
    
})

// Rota do servidor para criar novo diario de classe // postar conteudos

server.get('/diariocnteudo', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
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
            res.render('listaDiaria', {posts: posts})
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
    }).then(function(dados){      
            ult = dados.id;
        })
    Usuario.findAll({ 
        where: {
            turma: req.body.cmbTurma
        },
        raw : true 
    }).then(function(posts){
        res.render('presencaUsuarios', {posts: posts});        
    }).catch(function(erro){
        res.send("Ocorreu um erro " + erro)
    })
})

// Criar fk para de 1 presenca para n usuarios
server.post('/userchamada', function(req, res) {
    // Pega todos os valores do check box com o mesmo nome / o nome pode ser igual desde q o id seja diferente
    // no valor de cada opção checada coloca-se o id do usuario
    // este vetor tem somente as opções marcadas
    inputValue = req.body['idusuario'];    

    for (let index = 0; index < inputValue.length; index++) {
        // Criar usuario presenca fk com presenca
        UsuarioPresenca.create({
            codigoAluno:  inputValue[index],
            codigoPresenca:  ult
        })
    }
    res.render('presenca')
}) 

// Tela que lista todos os usuarios de certa turma para dar presença ou falta
server.get('/listapresenca', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('presenca', {posts: posts})
    })    
})

server.get('/lista_chamada_gravadas', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Presenca.findAll({        
        attributes: [
            'id',
            'oficina',
            'turma',
            'turno',
            [Presenca.sequelize.fn('date_format', Presenca.sequelize.col('dia'), '%d/%m/%Y'), 'dia_formed']
        ],
        order: [['dia', 'DESC'], ['turno', 'ASC']]
    })
        .then(function(posts){
        res.render('listaChamadas', {posts: posts})
    })    
})

// Lista os diarios de classe já cadastrados
server.get('/listardiario', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
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