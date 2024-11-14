const fs = require("fs")
const http = require("http")

const PORT = 3000
const HOSTNAME = "localhost"


const server = http.createServer((req,res) => {
    if(req.url === '/index.html' && req.method === 'GET'){
        fs.readFile('index.html', (err,data) => {
            if(err){
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(200,{ 'content-type': 'text/html'})
                res.end(data);
            }
        });
         } else {
        res.writeHead(404);
                res.end('404 Not Found');
     }

    });

server.listen(3000,HOSTNAME, () => {
    console.log(`server listening on http://${HOSTNAME}:${PORT}`)
})

