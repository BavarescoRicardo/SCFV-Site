const conexao = require('../conexao')

// constantes para os modelos que devem virar tabelas
const UsuarioPresenca = conexao.sequelize.define('usuarioPresenca', {
    codigoAluno: {
        type: conexao.Sequelize.INTEGER
    },
    codigoPresenca: {
        type: conexao.Sequelize.INTEGER
    }
})

 // UsuarioPresenca.sync({force: true});

module.exports = UsuarioPresenca