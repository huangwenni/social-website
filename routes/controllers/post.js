const DAO = require('../../db/db').DAO;
const postDB = new DAO('Post');
const myFriendDB = new DAO('MyFriend');
const userDB = new DAO('User');
const multer = require('multer');
const postImg = multer({dest: '../public/images/postImg'});
const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;
const Times = require('../../main/main').Time;

exports.showPost = (req, res) => {
    let userId = req.session.user._id;
    postDB.find({sendTo: userId}, {}, true).sort({created_time: -1}).then(postData => {
        let count = postData.length;
        let result = postData.map(item => {
            return new Promise(resolve => {
                userDB.find({_id: ObjectId(item.userId)}).then(userData => {
                    let format = new Times(item.created_time);
                    item.userName = userData.userName;
                    item.avater = userData.avater;
                    item.time = format.getDate('YY.MM.DD') + '&nbsp;&nbsp;' + format.getTime();
                    resolve(item);
                })
            })
        });
        Promise.all(result).then(postData => {
            res.render('post/post.html', {
                user: req.session.user,
                postMessage: postData,
                count
            })
        });
    });
};
exports.publishPost = (req, res) => {
    let file_type;
    let userId = req.session.user._id.toString();
    let body = req.body;
    if (req.file && req.file.mimetype.split('/')[0] == 'image') {
        file_type = '.' + req.file.mimetype.split('/')[1];
    }
    if (file_type) {
        fs.rename(req.file.path, req.file.path + file_type, err => {
            if (err) throw err;
            let path = '/images/postImg/' + req.file.filename + file_type;
            myFriendDB.find({userId}).then(data => {
                data.friends.push(userId);
                postDB.save({
                    userId,
                    message: body.message,
                    img: path,
                    sendTo: data.friends
                }).then(data => {
                    res.send({code: 0, msg: '发布成功'});
                })
            });
        });
    } else {
        myFriendDB.find({userId}).then(data => {
            data.friends.push(userId);
            postDB.save({
                userId,
                message: body.message,
                sendTo: data.friends
            }).then(data => {
                res.send({code: 0, msg: '发布成功'});
            })
        });
    }
};

