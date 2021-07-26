const express = require('express')
const Presenca = require('../models/Presenca')
const UsuarioPresenca = require('../models/UsuarioPresenca')
const Usuario = require('../models/Usuario')
const bodyParser = require('body-parser');
const rotas = express.Router();

// body-parser para pegar os inputs de um formulario do tipo post    
rotas.use(bodyParser.urlencoded({extended: false}))
rotas.use(bodyParser.json())

// Cadastrar nova chamada e em seguida listar os usuarios da turma selecionada para dar presença ou faltas
rotas.post('/novachamada', function(req, res) {
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
            turma: req.body.cmbTurma,
            turno: req.body.cmbTurno
        },
        raw : true 
    }).then(function(posts){
        res.render('presencaUsuarios', {posts: posts});        
    }).catch(function(erro){
        res.send("Ocorreu um erro " + erro)
    })
})

// Criar fk para de 1 presenca para n usuarios
rotas.post('/userchamada', function(req, res) {
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

// Listar as chamadas cadastradas por data da oficina
rotas.get('/lista_chamada_gravadas', function(req, res) {
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

// Detalhar os usuarios da chamada selecionada e mostrar os  presentes
rotas.get('/listar_usuarios_chamadas/:idpresenca', function(req, res) {    

    // Declarar dos arrays de presencas e usuarios
    let usersList = new Array();
    let presencaList = new Array();
    let idsProjects = new Array();
    UsuarioPresenca.findAll({ 
        attributes: ['codigoAluno'],
        where: {
            'codigoPresenca' : req.params.idpresenca
        }
    }).then(function(address){
        idsProjects = address;

        // Localizar data e turma da presenca selecionada
        Presenca.findOne({
                where: {  id: req.params.idpresenca },  raw : true 
        }).then(function(presc){            
            presencaList.push(presc)            
        }).catch(function(erro){  console.log("Ocorreu um erro " + erro) })

        // Laço para selecionar cada usuario
        for (let index = 0; index < idsProjects.length; index++) {
            var myID = idsProjects[index].codigoAluno;            
        
            Usuario.findOne({
                where: {  id: myID },  raw : true
                }).then(function(posts){
                    usersList.push(posts)
                }).catch(function(erro){  console.log("Ocorreu um erro " + erro) })
            }
        res.render('usuariosPresentesChamada', { presenca: presencaList,  posts: usersList } );        
    })
})

module.exports = rotas