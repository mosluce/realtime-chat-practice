var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: String,
    password: String,
    online: Boolean,
    sid: String
}, {/*options*/});

schema.plugin(timestamps);

module.exports = function (conn) {
    global.User = conn.model('User', schema);
};