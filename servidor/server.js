const http = require('http')

const server = http.createServer((req, res) => 
{
    console.log('URL depois do barra: ', req.url)

    switch (req.url) {
        case '/':
            res.end("<h1> Home com Switch </h1>")
            break;
        case '/supervisor':
            res.end("<h1> Supervisor com switch </h1>")
            break;
        default:
            res.end("<h1> Default com switch </h1>")
    }

})

server.listen(3001, 'localhost', () => {
    console.log('Servidor rodando em http:/localhost:3001')
})