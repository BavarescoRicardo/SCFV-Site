const Sequelize = require('sequelize')
const sequelize = new Sequelize('scfv', 'root', 'admin', {
    host: "localhost",
    dialect: "mysql"
})

// constantes para os modelos que devem virar tabelas
const Contato = sequelize.define('contato', {
    codigo: {
        type: Sequelize.INTEGER
    },
    contato: {
        type: Sequelize.STRING
    },
    tipo: {
        type: Sequelize.INTEGER
    }
})


const Escola = sequelize.define('escola', {
    codigo: {
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.STRING
    },
    observacao: {
        type: Sequelize.TEXT
    }
})

const Colaborador = sequelize.define('colaborador', {
    codigo: {
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.STRING
    },
    bairro: {
        type: Sequelize.STRING
    },
    datanasc: {
        type: Sequelize.DATE
    },
    codContato: {
        type: Sequelize.STRING
    }
})

const Responsavel = sequelize.define('responsavel', {
    codigo: {
        type: Sequelize.INTEGER
    },
    codigoUsuario: {
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.STRING
    },
    bairro: {
        type: Sequelize.STRING
    },
    datanasc: {
        type: Sequelize.DATE
    },
    codContato: {
        type: Sequelize.STRING
    }
})

const Usuario = sequelize.define('usuario', {
    codigo: {
        type: Sequelize.INTEGER
    },
    nome: {
        type: Sequelize.STRING
    },
    turno: {
        type: Sequelize.INTEGER
    },
    bairro: {
        type: Sequelize.STRING
    },
    datanasc: {
        type: Sequelize.DATE
    },
    turma: {
        type: Sequelize.INTEGER
    },
    idescola: {
        type: Sequelize.INTEGER
    }
})

    // Para criar uma tabela o banco referente ao modelo
    Usuario.sync({force: true});
    Escola.sync({force: true});
    Contato.sync({force: true});
    Colaborador.sync({force: true});
    Responsavel.sync({force: true});

        // // Para inserir um registro na tabela
        // Usuario.create({
        //     codigo: 1,
        //     nome: "Ricardo adm",
        //     turno: 1, // 1 equivale a manha e 2 equivale a vespertino
        //     bairro: "Centro",
        //     datanasc: '1997-12-04 00:00:00',
        //     idescola: 1,
        //     idturma: 1,
        // })

// sequelize.authenticate().then(function(){
//     console.log("Conectou ao banco MySql; database: scfv")
// }).catch(function(erro){
//     console.log("Erro conectar ao banco MySql; database: scfv")
// })