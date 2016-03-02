var db = require('./libs/database');

module.exports = function (server) {
    var io = require('socket.io')(server);
    var mongo = require('socket.io-adapter-mongo');

    io.adapter(mongo(db.MongoURL));

    io.on('connection', function (socket) {
        socket.emit('session', socket);
    });
};