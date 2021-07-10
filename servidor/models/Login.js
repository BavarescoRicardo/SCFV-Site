const conexao = require('./conexao')

// constantes para os modelos que devem virar tabelas
const Login = conexao.sequelize.define('login', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    senha: {
        type: conexao.Sequelize.STRING
    }
})

module.exports = Login
// Login.sync({force: true});