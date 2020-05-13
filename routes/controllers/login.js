const DAO = require('../../db/db').DAO;
const userDB = new DAO('User');
const myFriendDB = new DAO('MyFriend');
const photoDB = new DAO('PhotoWall');

exports.showLogin = (req, res, next) => {
    res.render('login');
};
exports.login = (req, res) => {
    let obj = {
        userName: req.body.userName,
        password: req.body.password
    };
    userDB.find(obj).then(data => {
        if (data) {
            req.session.user = data;
            res.send({code: 0, msg: '登陆成功'});
        } else {
            res.send({code: 1, msg: '昵称或密码错误'});
        }
    });
};
exports.showRegister = (req, res) => {
    res.render('register.html')
};
exports.register = (req, res) => {
    let body = req.body;
    let obj = {
        $or: [
            {studentNumber: body.studentNumber},
            {userName: body.userName}
        ]
    };
    userDB.find(obj).then(data => {
        if (data) {
            res.send({code: 1, msg: '学号或昵称已存在'});
        } else {
            userDB.save(body).then(data => {
                let userId = data._id.toString();
                myFriendDB.save({userId});
                photoDB.save({userId});
                res.send({code: 0, msg: '注册成功'});
            })
        }
    });
};
exports.showInterest = (req, res) => {
    res.render('interest.html');
};
exports.interest = (req, res) => {
    let userName = req.body.userName;
    let hobby = JSON.parse(req.body.hobby);
    userDB.update({userName}, {hobby}).then(data => res.send({code: 0, msg: '设置hobby成功'}));
};
exports.logout = (req, res) => {
    req.session.user = null;
    res.redirect('/index');
};
