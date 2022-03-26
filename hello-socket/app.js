const express = require('express');
const Http = require('http');
const socketIo = require('socket.io');

const app = express();
const http = Http.createServer(app);
const io = socketIo(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.get('/test', (req, res) => {
    res.send('에스프레소 잘 켜져있습니다');
});

http.listen(3000, () => {
    console.log('서버 ON');
});

io.on('connection', (socket) => {
    console.log('열렸엉');

    socket.send('ㄹㅇ?');

    socket.emit('customEventName', '아 졸립다~');
});