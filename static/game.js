name = prompt("Enter your name");




var socket = io.connect();


var room = "room1";

socket.on('connect', function() {
    // Connected, let's sign-up for to receive messages for this room
    socket.emit('room', room);
});


socket.on('message', function(data) {
    console.log(data);
});

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.addEventListener('keydown', function(event) {

    if($('#chatBar input').is(":focus")) {
        return false;
    };

    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
    }
});
document.addEventListener('keyup', function(event) {
    if($('#chatBar input').is(":focus")) {
        return false;
    };

    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
    }
});

socket.emit('new player', name);
setInterval(function() {
    if($('#chatBar input').is(":focus")) {
        return false;
    };
    socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('state', function(players) {
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fill();
    }
});

socket.on('chatList', function(message) {

    $('#chatList ul').append('<li> <strong>'+message['player']+'</strong>' +message['text']+ '</li>');

    console.log(message);
})


socket.on('playerDiconected', function(player) {

    $('#chatList ul').append("<li> Player <strong>"+player+"</strong> diconected!</li>");
})


socket.on('playerJoined', function(player) {

    $('#chatList ul').append("<li> Player <strong>"+player+"</strong> joined!</li>");
})


$('#chatBar input').keypress(function (e) {
    if (e.which == 13 && $('#chatBar input').val()) {
        socket.emit('chat', $('#chatBar input').val());
        $('#chatBar input').val('');
    }
});