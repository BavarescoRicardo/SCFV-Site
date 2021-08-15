const express = require('express');
const bodyParser = require('body-parser');
const mapas = express.Router();

// body-parser para pegar os inputs de um formulario do tipo post    
mapas.use(bodyParser.urlencoded({extended: false}))
mapas.use(bodyParser.json())

// Modelos
const Diaria = require('../models/Diaria')
const Usuario = require('../models/Usuario')
const Escola = require('../models/Escola')
const Mapa = require('../models/Mapa')
const MapaUsuario = require('../models/MapaUsuario')






// Declarar dos arrays de presencas e usuarios
let usersList = new Array();
let usuario_mapaIds = new Array();


// Selecionar mapas das salas
mapas.get('/mapa', function(req, res) {
     res.redirect('listamapas')
})



// Tela que lista todos os mapas
mapas.get('/listamapas', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Mapa.findAll(
            {
                group: ['id', 'turma'],
                order: [['turma', 'ASC']]
            }
        ).then(function(posts){
        // console('executado antes de carregar useuarios')
        res.render('mapa_Sala', {mapa: posts})
    })    
})


// Selecionar os usuarios atribuidos aos computadores
// Detalhar os usuarios que estavam presentes em uma chamada selecionada 
mapas.post('/listar_usuarios_mapas', function(req, res) {    
    usersList = [];
    // let usuario_mapaIds = [];

    // Localizar data e turma da presenca selecionada
    Mapa.findOne({
        where: {  turma: req.body.cmbTurma, turno: req.body.cmbTurno },  raw : true 
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
                res.render('mapa_Sala', { urss: resultados, idmapa: map.id }) 
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


// Editar mapa da sala
mapas.get('/editar/:id', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
        Mapa.findOne(
            {
                where: {  turma: req.params.id },  raw : true
            }
        ).then(function(posts){            
            Usuario.findAll({
                where: {  turma: req.params.id },
                order: [['nome', 'ASC']],  raw : true
            }).then(function(users){
                // Verifica se o vetor esta carregado
                if(users.length > 10) 
                {                    
                    console.log("tamanho da lista de mapas " + posts.length);
                    console.log("lista de usuarios:  " + users.length);
                    res.render('mapa_Sala_editar', {mapa: posts, usuar: users});
                }
            })
        
    })    
})


// Editar mapa
mapas.post('/confirmar_editacao/:mapa', async function(req, res) {             
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    try {
        // Laço de usuarios ?
        await MapaUsuario.update({ cod_usuario: req.body.cmbUsuarioPc1 }, {
            where: {
                cod_mapa: req.params.mapa
            }
          })        
        .then(result =>
            res.render('mapa_Sala')
        )
    } finally 
    {
        console.log('numero do mapa salvo na pagina  ' + req.body.mapaid+ ' codigo do usuario selecionado ' + req.body.cmbUsuarioPc1)
        console.log('log conse no finalmente')
    }
})



module.exports = mapas