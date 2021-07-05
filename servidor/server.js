const http = require('http')

const server = http.createServer((req, res) => 
{
    console.log('URL depois do barra: ', req.url)

    switch (req.url) {
        case '/':
            res.send('<h1>Certo /</h1>')
            break;
        case "supervisor":
            res.send('<h1>Certo supervisor</h1>')
            break;
        default:
            res.send('<h1>Certo default</h1>')
    }
})

server.listen(3001, 'localhost', () => {
    console.log('Servidor rodando em- http:/localhost:3001')
})