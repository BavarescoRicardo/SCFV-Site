const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas
const Diaria = conexao.sequelize.define('diaria', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    dia: {
        type: conexao.Sequelize.DATE
    },
    turma: {
        type: conexao.Sequelize.INTEGER
    },
    oficina: {
        type: conexao.Sequelize.INTEGER
    },
    turno: {
        type: conexao.Sequelize.INTEGER
    },
    conteudo: {
        type: conexao.Sequelize.TEXT
    },
    observacao: {
        type: conexao.Sequelize.STRING
    }
})

// Diaria.sync({force: true});
module.exports = Diaria