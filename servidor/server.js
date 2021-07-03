const http = require('http')

const server = http.createServer((req, res) => 
{
    console.log('URL depois do barra: ', req.url)

    switch (req.url) {
        case '/':
            salario *= 1.15;
            break;
        case "supervisor":
            salario *= 1.10;
            break;
        default:
            salario *= 1.05;
    }

    res.end('<h1>Resultado</h1>')
})

server.listen(3001, 'localhost', () => {
    console.log('Servidor rodando em- http:/localhost:3001')
})