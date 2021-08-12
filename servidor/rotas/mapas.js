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



// Tela que lista todos os usuarios de certa turma para dar presença ou falta
mapas.get('/listamapas', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Mapa.findAll(
            {
                group: ['turma'],
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


module.exports = mapas