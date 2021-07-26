const express = require('express');
const bodyParser = require('body-parser');
const usuarios = express.Router();

// body-parser para pegar os inputs de um formulario do tipo post    
usuarios.use(bodyParser.urlencoded({extended: false}))
usuarios.use(bodyParser.json())

// Cadastrar nova chamada e em se
const handlebars = require('express-handlebars')

// Sessao
const session = require("express-session")

// Modelos
const Usuario = require('../models/Usuario')
const Escola = require('../models/Escola')

usuarios.post('/cadastrousuario', function(req, res) {             
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
            res.redirect('/usuarios/usuariolista');
         }).catch(function(erro){
             res.send("Ocorreu um erro " + erro)
         })
})

usuarios.get('/cadastrousuario', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    res.render('cadastrousuario')
})


usuarios.get('/usuariolista', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('listausuarios', {posts: posts})
    })  
})

// Tela que lista todos os usuarios de certa turma para dar presença ou falta
usuarios.get('/listapresenca', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined) res.render('login_error');            
    Usuario.findAll({order: [['nome', 'ASC']]}).then(function(posts){
        res.render('presenca', {posts: posts})
    })    
})

usuarios.get('/deletar/:user', function(req, res) {        
    Usuario.destroy({where: {'id' : req.params.user}}).then(function(){
        res.redirect('/usuarios/usuariolista');
    }).catch(function(erro){
        console.log("Item nao encontrado " +req.params.user + " " + erro)
    })
})

module.exports = usuarios