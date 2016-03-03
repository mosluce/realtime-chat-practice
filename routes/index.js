var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var salt = 'JKldjasljdldaslkfdjdwslfjlwjlfjadzlksjflds';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/user/login', function (req, res, next) {
    var data = req.body;

    if(!data.username || !data.password) {
        res.status(400);
        res.send({
            message: '輸入格式錯誤'
        });
        return;
    }

    try {
        User.findOne({
            username: data.username
        }).exec().then(function (user) {
            if (user) {
                bcrypt.compare(data.password, user.password, function(err, result) {

                    if(result) {
                        res.send({});
                    } else {
                        res.status(400);
                        res.send({
                            message: '密碼錯誤'
                        });
                    }
                });
            } else {
                bcrypt.genSalt(8, function(err, salt) {
                    bcrypt.hash(data.password, salt, function(err, hash) {
                        data.password = hash;

                        User.create(data).then(function () {
                            res.send({});
                        });
                    });
                });
            }
        });
    } catch (ex) {
        next(ex);
    }
});

router.get('/user/online', function (req, res, next) {
    User.find({online: true}, {password: false, sid: false})
        .sort('username')
        .exec()
        .then(function (users) {
            res.send(users);
        });
});

module.exports = router;
