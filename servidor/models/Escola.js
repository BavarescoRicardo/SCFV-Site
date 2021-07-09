const conexao = require('./conexao')

// constantes para os modelos que devem virar tabelas
const Escola = conexao.sequelize.define('escola', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    observacao: {
        type: conexao.Sequelize.TEXT
    }
})