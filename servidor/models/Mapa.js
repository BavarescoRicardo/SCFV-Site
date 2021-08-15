const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas
const Mapa = conexao.sequelize.define('mapa', {
    turma: {
        type: conexao.Sequelize.INTEGER
    },
    turno: {
        type: conexao.Sequelize.INTEGER
    },
    observacoes: {
        type: conexao.Sequelize.TEXT
    }
})

// Mapa.sync({force: true});

module.exports = Mapa
