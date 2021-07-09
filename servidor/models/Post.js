const conexao = require('./conexao')

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

const Colaborador = conexao.sequelize.define('colaboradore', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    bairro: {
        type: conexao.Sequelize.STRING
    },
    datanasc: {
        type: conexao.Sequelize.DATE
    },
    codContato: {
        type: conexao.Sequelize.STRING
    }
})

const Responsavel = conexao.sequelize.define('responsavel', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    codigoUsuario: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    bairro: {
        type: conexao.Sequelize.STRING
    },
    datanasc: {
        type: conexao.Sequelize.DATE
    },
    codContato: {
        type: conexao.Sequelize.STRING
    }
})

const Usuario = conexao.sequelize.define('usuario', {
    codigo: {
        type: conexao.Sequelize.INTEGER
    },
    nome: {
        type: conexao.Sequelize.STRING
    },
    turno: {
        type: conexao.Sequelize.INTEGER
    },
    bairro: {
        type: conexao.Sequelize.STRING
    },
    datanasc: {
        type: conexao.Sequelize.DATE
    },
    turma: {
        type: conexao.Sequelize.INTEGER
    },
    idescola: {
        type: conexao.Sequelize.INTEGER
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

// conexao.Sequelize.authenticate().then(function(){
//     console.log("Conectou ao banco MySql; database: scfv")
// }).catch(function(erro){
//     console.log("Erro conectar ao banco MySql; database: scfv")
// })

