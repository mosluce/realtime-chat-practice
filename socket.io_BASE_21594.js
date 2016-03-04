var db = require('./libs/database');

module.exports = function (server) {
    var io = require('socket.io')(server);
    var mongo = require('socket.io-adapter-mongo');

    io.adapter(mongo(db.MongoURL));

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            try {
                console.log(socket.user.username + ' disconnect');
                User.findOne({
                    username: socket.user.username
                }).exec().then(function (user) {
                    user.online = false;
                    user.sid = null;
                    user.save().then(function () {
                        io.emit('onlineChange');
                    });
                });
            } catch (ex) {

            }
        });

        socket.on('join', function (data) {
            console.log(data.username, 'join', socket.id);

            User.findOne(data).exec()
                .then(function (user) {
                    if (user) {
                        socket.user = user;

                        user.sid = socket.id;
                        user.online = true;
                        user.save().then(function () {
                            io.emit('onlineChange');

                            Message.find({
                                $or: [{
                                    to: user.username
                                }, {
                                    to: null
                                }]
                            }).sort('-time').exec().then(function(messages) {
                                socket.emit('history', messages);
                            });
                        });
                    } else {
                        socket.emit('accessFailure', {
                            message: 'username is not exists.'
                        });
                    }
                });
        });

        socket.on('message', function (data) {
            var message = {
                username: socket.user.username,
                content: data.content,
                time: data.time,
                private: false
            };

            if (data.username) {
                User.findOne({
                    username: data.username
                }).exec().then(function (user) {
                    if (user && user.online) {
                        try {
                            var pm = io.to(user.sid);
                            message.private = true;
                            message.to = user.username;
                            message.sid = user.sid;

                            Message.create(message);

                            pm.emit('message', message);
                        } catch (ex) {
                            console.log(ex, io);
                        }
                    } else {
                        socket.emit('messageFailure', {
                            message: '傳送對象不存在或已離線'
                        });
                    }
                });
            } else {
                Message.create(message);
                socket.broadcast.emit('message', message);
            }

            //刪除超過四個小時的資料
            var expires = new Date();
            expires.setHours(expires.getHours() - 1);

            Message.remove({
                time: {
                    $lt: expires
                }
            }).exec();
        });
    });
};