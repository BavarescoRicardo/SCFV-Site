const conexao = require('./conexao')

// constantes para os modelos que devem virar tabelas
const MapaUsuario = conexao.sequelize.define('mapausuario', {
    cod_usuario: {
        type: conexao.Sequelize.INTEGER
    },
    cod_maquina: {
        type: conexao.Sequelize.INTEGER
    },
    cod_mapa: {
        type: conexao.Sequelize.INTEGER
    }
})

// MapaUsuario.sync({force: true});
