var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/user/login', function (req, res, next) {
    var data = req.body;

    try {
        User.findOne({
            username: data.username
        }).exec().then(function (user) {
            if (user) {
                if (user.password === data.password) {
                    res.send({});
                } else {
                    res.status(400);
                    res.send({
                        message: '密碼錯誤'
                    });
                }
            } else {
                User.create(data).then(function () {
                    res.send({});
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
