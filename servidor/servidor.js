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
let mensagemLogin = [];


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
        req.session.login = req.body.user;
        req.session.permissao = logdao.permissao;

        // Definir usuario e mensagem de login
        mensagemLogin =  req.body.user + "  :Nivel: " + logdao.permissao;

        res.redirect('/usuarios/usuariolista');
    }).catch(function(erro){
        req.session.login = null;
        mensagemLogin = "Usuario não encontrado";
        res.render('login_error', {msg: mensagemLogin});
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













// Trabalhando com promessas para obter o mapa da sala
    // const promise = promessa_ListaMapas();
    // const promise2 = promise.then(successCallback, failureCallback);

// Declarar dos arrays de presencas e usuarios
let usersList = new Array();
let usuario_mapaIds = new Array();


// Selecionar mapas das salas
// var request = require('request'),
//     username = "ricardo",
//     password = "1234",
//     url = "http://localhost:8081/mapa",
//     auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

server.get('/mapa', function(req, res) {
    //             // Teste autenticação

    //             var header = {'Host': '/mapa', 'Authorization': auth};
    //             // o que é esse hearder?
    //             console.log('hearder eh: ' +header.Authorization)
    //             // o que vem no request?
    //             console.log('request eh: ' +req.body.Authorization)
    //  if(req.Authorization == header.Authorization) 
     res.redirect('listamapas')
})



// Tela que lista todos os usuarios de certa turma para dar presença ou falta
server.get('/listamapas', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Mapa.findAll({order: [['turma', 'ASC']]}).then(function(posts){
        // console('executado antes de carregar useuarios')
        res.render('mapa_Sala', {mapa: posts})
    })    
})


// Selecionar os usuarios atribuidos aos computadores
// Detalhar os usuarios que estavam presentes em uma chamada selecionada 
server.post('/listar_usuarios_mapas', function(req, res) {    

    // Localizar data e turma da presenca selecionada
    Mapa.findOne({
        where: {  id: req.body.cmbTurma },  raw : true 
    }).then(function(map){            

        MapaUsuario.findAll({ 
            attributes: ['cod_usuario'],
            where: {
                'cod_mapa' : map.id
            },  raw : true 
        }).then(async function(result_idUsuarios){
            usuario_mapaIds = result_idUsuarios;
            
            // Chamar função promessa
            await promessa_ListaMapas().then(function()
            {
                // Conferir se ja foram carregados os usuarios ou chamar novamente o metodo de carregar 
                if(usersList.length < 10)promessa_ListaMapas() 
                let resultados = usersList;
                res.render('mapa_Sala', { urss: resultados }) 
            })            
        })
    })
})

async function promessa_ListaMapas()
{
    let usuariosmapeados;
    try{
    // Laço para selecionar cada usuario    
        for await (const mp_user of usuario_mapaIds) {
            var myID = mp_user.cod_usuario;            
            await Usuario.findOne({
                where: {  id: myID },  raw : true
                }).then(async function(postes){
                    usersList.push(postes)
                }).catch(function(erro){  console.log("Ocorreu um erro " + erro) })
        }                
    
    }
    finally
    {
        return usuariosmapeados;
    }
}