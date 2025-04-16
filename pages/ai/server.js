const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;
const rootDir = './public';
const dataFile1 = path.join(__dirname, 'w1.txt');
const dataFile2 = path.join(__dirname, 'w2.txt');
const firstLayer = 784;
const secondLayer = 1000;
const thirdLayer = 10;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Обработка GET /get-clicks
    if (req.method === 'GET' && pathname === '/get-w1') {
        try {
            const data = fs.readFileSync(dataFile1, 'utf8');
            let n = data.trim().split(/\s+/).map(Number);
            let w1 = [];
            for (let i = 0; i < firstLayer; ++i){
                let w = [];
                for (let j = 0; j < secondLayer; ++j){
                    w.push(n[i*secondLayer + j]);
                }
                w1.push(w);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(w1));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Failed to read file" }));
        }
        return;
    }
    if (req.method === 'GET' && pathname === '/get-w2') {
        try {
            const data = fs.readFileSync(dataFile2, 'utf8');
            let n = data.trim().split(/\s+/).map(Number);
            let w2 = [];
            for (let i = 0; i < secondLayer; ++i){
                let w = [];
                for (let j = 0; j < thirdLayer; ++j){
                    w.push(n[i*thirdLayer + j]);
                }
                w2.push(w);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(w2));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Failed to read file" }));
        }
        return;
    }

    let filePath = path.join(rootDir, pathname === '/' ? 'page.html' : pathname);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js': contentType = 'application/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});