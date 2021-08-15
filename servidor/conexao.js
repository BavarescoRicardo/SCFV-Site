    // Conexão com o banco
    const Sequelize = require('sequelize');

    const sequelize = new Sequelize('scfv', 'root', 'admin', {
        host: "localhost",
        dialect: "mysql"
    })
    
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}