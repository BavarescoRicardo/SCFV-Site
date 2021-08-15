    // Conexão com o banco
    const Sequelize = require('sequelize');

    const sequelize = new Sequelize('scfv', 'postgres', 'admin', {
        host: "localhost",
        dialect: "postgresql"
    })
    
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}