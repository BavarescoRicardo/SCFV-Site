const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas
const Contato = conexao.sequelize.define('contato', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    contato: {
        type: conexao.Sequelize.STRING
    },
    tipo: {
        type: conexao.Sequelize.INTEGER
    }
})

// Contato.sync({force: true});

module.exports = Contato