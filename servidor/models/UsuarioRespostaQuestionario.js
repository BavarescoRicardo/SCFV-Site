const conexao = require('./conexao')

// constantes para os modelos que devem virar tabelas
const UsuarioRespostaQuestionario = conexao.sequelize.define('questionario', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    codigoUsuario: {
        type: conexao.Sequelize.INTEGER
    },
    codigoPresenca: {
        type: conexao.Sequelize.INTEGER
    },
    resposta: {
        type: conexao.Sequelize.TEXT
    }
})

// UsuarioRespostaQuestionario.sync({force: true});

module.exports = UsuarioRespostaQuestionario