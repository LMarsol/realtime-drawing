const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socket.listen(server);

server.listen(3000, () => {
    console.log('running...');
});

app.use(express.static(__dirname + '/public'));

const drawHistory = []

io.on('connection', (socket) => {
    console.log('new connection');

    drawHistory.forEach(line => {
        //only emit for the new connection
        socket.emit('ondraw', line);
    });

    socket.on('ondraw', (line) => {
        drawHistory.push(line);
        //emit for all
        io.emit('ondraw', line)
    });
});