const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// index.html dosyasını statik olarak sunar
app.use(express.static(__dirname));

const players = {};

// Oyuncu bağlandığında
io.on('connection', (socket) => {
    console.log('Yeni oyuncu bağlandı:', socket.id);

    players[socket.id] = {
        id: socket.id,
        x: 0, y: 0, z: 0,
        rotation: 0,
        isMoving: false,
        username: "Oyuncu",
        profile: null
    };

    // Yeni oyuncuya, içerideki mevcut oyuncuları gönder
    socket.emit('currentPlayers', players);

    // İçerideki oyunculara, yeni gelen oyuncuyu bildir
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Oyuncu haritada hareket ettiğinde veya profilini güncellediğinde
    socket.on('playerMovement', (data) => {
        if(players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].z = data.z;
            players[socket.id].rotation = data.rotation;
            players[socket.id].isMoving = data.isMoving;
            players[socket.id].username = data.username;
            players[socket.id].profile = data.profile;
            
            // Konumu ve bilgileri diğer herkese yansıt
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // Oyuncu oyundan çıktığında
    socket.on('disconnect', () => {
        console.log('Oyuncu ayrıldı:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Apex Sunucusu ${PORT} portunda aktif!`);
});
