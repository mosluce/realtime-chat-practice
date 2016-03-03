/**
 * Created by mosluce on 2016/3/3.
 */
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var schema = new Schema({
    content: String,
    username: String, //from username
    to: String, //to username
    sid: String, //to sid
    time: Date,
    private: Boolean
}, {/*options*/});

schema.plugin(timestamps);

module.exports = function (conn) {
    global.Message = conn.model('Message', schema);
};