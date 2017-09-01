var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var playersList = {};

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
 
// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
 
// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});

playerRoom = '';

var players = {};
io.on('connection', function(socket) {
    const _id = socket.id

    socket.on('room', function(room) {
        playerRoom = room;
        socket.join(playerRoom);
    });


    room = "room1";

    socket.on('disconnect', function(data) {
        socket.join(data);
    });

    socket.on('disconnect', function() {
        console.log('playerDiconected');
        var name = playersList[_id];
        delete players[_id];
        delete playersList[_id];
        io.sockets.in(playerRoom).emit('playerDiconected', name);
    });

    socket.on('new player', function(name) {

        playersList[socket.id] = name;
        players[socket.id] = {
            x: 300,
            y: 300
        };

        io.sockets.in(playerRoom).emit('playerJoined', name);
    });

    socket.on('chat', function(text) {

        message = {};
        message['player'] = playersList[socket.id];
        message['text'] = text;
        console.log(message);
        io.sockets.in(playerRoom).emit('chatList', message);
    });

    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });
});

setInterval(function() {
    io.sockets.in(playerRoom).emit('state', players);
}, 1000 / 60);