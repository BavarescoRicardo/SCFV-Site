const conexao = require('./conexao')

// constantes para os modelos que devem virar tabelas
const Usuario = conexao.sequelize.define('usuario', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    turno: {
        type: conexao.Sequelize.INTEGER
    },
    bairro: {
        type: conexao.Sequelize.STRING
    },
    datanasc: {
        type: conexao.Sequelize.DATE
    },
    turma: {
        type: conexao.Sequelize.INTEGER
    },
    idescola: {
        type: conexao.Sequelize.INTEGER
    }
})

    // Usuario.sync({force: true});

    module.exports = Usuario