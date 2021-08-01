const express = require('express');
const bodyParser = require('body-parser');
const diarios = express.Router();

// body-parser para pegar os inputs de um formulario do tipo post    
diarios.use(bodyParser.urlencoded({extended: false}))
diarios.use(bodyParser.json())

// Modelos
const Diaria = require('../models/Diaria')
const Usuario = require('../models/Usuario')
const Escola = require('../models/Escola')

// Rota do servidor para criar novo diario de classe // postar conteudos
diarios.get('/diariocnteudo', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined || (!req.session.permissao > 0))
    {
        res.render('login_error', {msg: mensagemLogin});
    }             
    res.render('diaria')
})

diarios.post('/novodiario', function(req, res) {
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
diarios.get('/listardiario', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined || (!req.session.permissao > 0) ) res.render('login_error');            
    Diaria.findAll({        
        attributes: [
            'id',
            'conteudo',
            'turma',
            'turno',
            'observacao',
            [Diaria.sequelize.fn('date_format', Diaria.sequelize.col('dia'), '%d/%m/%Y'), 'dia_formed']
        ],
        order: [['dia', 'DESC'], ['turno', 'ASC']]
    })
        .then(function(posts){
        res.render('listaDiaria', {posts: posts})
    })    
})

// Filtrar os diarios de classe já cadastrados
diarios.post('/listardiario_filtro', function(req, res) {
    if(req.session.login === 0 || req.session.login == undefined || (!req.session.permissao > 0) ) res.render('login_error');            
    Diaria.findAll({        
        attributes: [
            'id',
            'conteudo',
            'turma',
            'turno',
            'observacao',
            [Diaria.sequelize.fn('date_format', Diaria.sequelize.col('dia'), '%d/%m/%Y'), 'dia_formed']
        ],        
        where: {
            turma: req.body.cmbTurma,
            turno: req.body.cmbTurno
        },
        order: [['dia', 'DESC'], ['turno', 'ASC']]
    })
        .then(function(posts){
        res.render('listaDiaria', {posts: posts})
    })    
})

module.exports = diarios