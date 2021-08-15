const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas
const Presenca = conexao.sequelize.define('presenca', {
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
    }
})

// Presenca.sync({force: true});

module.exports = Presenca