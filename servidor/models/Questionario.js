const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas
const Questionario = conexao.sequelize.define('questionario', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    codigoProfessorLogado: {
        type: conexao.Sequelize.INTEGER
    },
    codigoPresenca: {
        type: conexao.Sequelize.INTEGER
    },
    questao: {
        type: conexao.Sequelize.TEXT
    }
})

// Questionario.sync({force: true});

module.exports = Questionario