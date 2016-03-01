module.exports = function (server) {
    var io = require('socket.io')(server);
    //var mongo = require('socket.io-adapter-mongo');

    //io.adapter(mongo('mongodb://localhost/play-chat'));

    io.on('connection', function (socket) {

        socket.on('message', function(data) {
            data.created_at = new Date();
            io.emit('message', data);
        });
    });
};