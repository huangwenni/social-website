const DAO = require('../../db/db').DAO;
const userDB = new DAO('User');
const fs = require('fs');

exports.showPer = (req, res) => {
    let birthday = req.session.user.birthday.toString().substr(0, 10);
    req.session.user.birthday = birthday;
    res.render('personal/message.html', {
        user: req.session.user
    });
};
exports.modify = (req, res) => {
    let userId = req.session.user._id;
    let body = req.body;
    userDB.update({_id: userId}, {
        userName: body.userName,
        signature: body.signature,
        gender: body.gender,
        birthday: body.birthday,
        specialty: body.specialty,
        email: body.email,
        introduce: body.introduce
    }).then(data => {
        userDB.find({_id: userId}).then(userData => {
            req.session.user = userData;
            res.send({code: 0, msg: '修改成功'});
        });
    });
};
exports.showAvater = (req, res) => {
    res.render('personal/avater.html', {
        user: req.session.user
    })
};
exports.modifyAvater = (req, res) => {
    let userId = req.session.user._id;
    let file_type;
    if (req.file && req.file.mimetype.split('/')[0] == 'image') {
        file_type = '.' + req.file.mimetype.split('/')[1];
    }
    if (file_type) {
        fs.rename(req.file.path, req.file.path + file_type, function () {
            let path = '/images/upAvater/' + req.file.filename + file_type;
            userDB.update({_id: userId}, {avater: path}).then(data => {
                req.session.user.avater = path;
                res.send({code: 0, msg: '修改头像成功'});
            })
        })
    }
};
exports.showSafe = (req, res) => {
    res.render('personal/safe.html', {
        user: req.session.user
    })
};
exports.showRecord = (req, res) => {
    res.render('personal/record.html', {
        user: req.session.user
    })
};