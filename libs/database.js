var Promise = require('bluebird');
var mongoose = require('mongoose');
var url = process.env.MONGO_URL || 'mongodb://localhost/play-chat';
var fs = require('fs');
var path = require('path');

exports.MongoURL = url;

exports.connect = function() {
    if(mongoose.connection.db) return Promise.resolve();

    return new Promise(function(resolve, reject) {
        var conn = mongoose.connection;

        // CONNECTION EVENTS
        // When successfully connected
        conn.on('connected', function () {
            console.log('Mongoose default connection open to ' + url);

            var files = fs.readdirSync(path.join(__dirname, 'models'));

            files.forEach(function(file) {
                if(!/\.js$/.test(file)) return;

                require(path.join(__dirname, 'models', file))(conn);
            });

            resolve();
        });

        // If the connection throws an error
        conn.on('error', function (err) {
            console.log('Mongoose default connection error: ' + err);
            reject(err);
        });

        // When the connection is disconnected
        conn.on('disconnected', function () {
            console.log('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function () {
            conn.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        mongoose.connect(url);
    });
};