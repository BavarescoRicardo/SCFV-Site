const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas

const Responsavel = conexao.sequelize.define('responsavel', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    codigoUsuario: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    bairro: {
        type: conexao.Sequelize.STRING
    },
    datanasc: {
        type: conexao.Sequelize.DATE
    },
    codContato: {
        type: conexao.Sequelize.STRING
    }
})