var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/**
 * LOGIN API
 */
router.post('/user/login', function (req, res, next) {
    var data = req.body;

    if (!data.username || !data.password) {
        res.status(400);
        res.send({
            message: '輸入格式錯誤'
        });
        return;
    }

    function loginOrCreate(data) {
        return new Promise(function (resolve, reject) {
            User.findOne({
                username: data.username
            }).exec().then(function (user) {
                if (user) {
                    //比對密碼
                    bcrypt.compare(data.password, user.password, function (err, result) {
                        if (err) return reject(err);

                        if (result) {
                            req.session.user = {
                                username: user.username
                            };
                            resolve();
                        } else {
                            reject({
                                message: '密碼錯誤'
                            });
                        }
                    });
                } else {
                    //密碼加鹽
                    bcrypt.genSalt(8, function (err, salt) {
                        if (err) return reject(err);

                        bcrypt.hash(data.password, salt, function (err, hash) {
                            if (err) return reject(err);

                            data.password = hash;

                            User.create(data).then(function (user) {
                                req.session.user = {
                                    username: user.username
                                };
                                resolve();
                            });
                        });
                    });
                }
            });
        });
    }

    loginOrCreate(data)
        .then(function () {
            res.send({});
        }, function (err) {
            res.status(400);
            res.send(err);
        })
        .catch(function (ex) {
            res.status(500);
            res.send(ex);
        });
});

/**
 * GET ONLINE USERS
 */
router.get('/user/online', function (req, res, next) {
    User.find({online: true}, {password: false, sid: false})
        .sort('username')
        .exec()
        .then(function (users) {
            res.send(users);
        });
});

/**
 * GET SESSION
 */
router.get('/user/me', function (req, res, next) {
    if (req.session.user) return res.send(req.session.user);

    res.status(400);
    res.send({
        message: 'unauthorized'
    });
});

module.exports = router;
