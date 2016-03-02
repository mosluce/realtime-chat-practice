var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var name = 'User';
var schema = new Schema({
    username: String
}, {/*options*/});

schema.plugin(timestamps);

module.exports = function (conn) {
    global[name] = conn.model(name, schema);
};