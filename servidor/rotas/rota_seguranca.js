const express = require('express');
const bodyParser = require('body-parser');
const rota_seguranca = express.Router();

// body-parser para pegar os inputs de um formulario do tipo post    
rota_seguranca.use(bodyParser.urlencoded({extended: true}))
rota_seguranca.use(bodyParser.json())

// Modelos
const Usuario = require('../models/Usuario')




// Selecionar mapas das salas
rota_seguranca.get('/atividade', function(req, res) {
     res.render('testeControleAcesso')
})



              // Tela que lista todos os mapas
            // mapas.get('/listamapas', function(req, res) {
            //     if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
            //     Mapa.findAll(
            //             {
            //                 group: ['id', 'turma'],
            //                 order: [['turma', 'ASC']]
            //             }
            //         ).then(function(posts){
            //         // console('executado antes de carregar useuarios')
            //         res.render('mapa_Sala', {mapa: posts})
            //     })    
            // })

module.exports = rota_seguranca