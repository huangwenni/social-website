const DAO = require('../../db/db').DAO;
const userDB = new DAO('User');
const msgDB = new DAO('Message');
const visiterDB = new DAO('Visitor');
const fiendDB = new DAO('MyFriend');
const postDB = new DAO('Post');
const photoDB = new DAO('PhotoWall');
const msgBoardDB = new DAO('Board');
const Times = require('../../main/main').Time;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

exports.showMyHome = (req, res) => {
    let userId = req.session.user._id;
    let msgData;
    msgDB.find({userId: userId.toString()}, {}, true).sort({created_time: -1})
        .then(msgData => {
            return new Promise(resolve => {
                let result = msgData.map(item => {
                    return new Promise(resolve => {
                        let format = new Times(item.created_time);
                        item.time = format.getDate('YY.MM.DD') + '&nbsp;&nbsp;&nbsp;' + format.getTime();
                        resolve(item);
                    })
                });
                resolve(result);
            });
        })
        .then(result => {
            return Promise.all(result)
        })
        .then(msg => {
            msgData = msg;
            return visiterDB.find({userId: userId.toString()}, {}, true)
        })
        .then(data => {
            return new Promise(resolve => {
                let result = data.map(item => {
                    return new Promise(resolve => {
                        userDB.find({_id: ObjectId(item.visitorId)}).then(visitor => {
                            resolve(visitor)
                        })
                    });
                });
                resolve(result);
            })
        })
        .then(result => {
            return new Promise(resolve => {
                Promise.all(result).then(visitorData => {
                    resolve(visitorData);
                })
            });
        })
        .then(visiterData => {
            res.render('myHome/myHome.html', {
                user: req.session.user,
                message: msgData,
                myVisitor: visiterData
            });
        });
};
exports.publishPost = (req, res) => {
    let userId = req.session.user._id.toString();
    let msg = {};
    msg.userId = userId;
    msg.message = req.body.message;
    msgDB.save(msg);
    fiendDB.find({userId}).then(friendData => {
        if (friendData.friends) {
            postDB.save({
                userId,
                message: msg.message,
                sendTo: friendData.friends
            }).then(data => {
                res.send({code: 0, msg: '发布成功'});
            })
        } else {
            res.send({code: 0, msg: '发布成功'});
        }
    })
};
exports.showAlbum = (req, res) => {
    res.render('myHome/album.html', {
        user: req.session.user,
    })
};
exports.upPhoto = (req, res) => {
    let userId = req.session.user._id.toString();
    let file_type;
    if (req.file && req.file.mimetype.split('/')[0] == 'image') {
        file_type = '.' + req.file.mimetype.split('/')[1];
    }
    if (file_type) {
        fs.rename(req.file.path, req.file.path + file_type, err => {
            if (err) throw err;
            let path = '/images/upAlbum/' + req.file.filename + file_type;
            photoDB.find({userId}).then(data => {
                if (data.photo.length === 5) {
                    res.send({code: 1, msg: '已达到添加上限！'});
                } else {
                    photoDB.update({userId}, {'$push': {photo: path}}).then(data => {
                        res.send({code: 0, msg: '添加成功！'});
                    })
                }
            })
        });
    }
};
exports.getPhoto = (req, res) => {
    let userId = req.session.user._id.toString();
    photoDB.find({userId}).then(data => {
        res.send({code: 0, msg: '获取图片数据成功', photo: data.photo})
    });
};
exports.resetPhoto = (req, res) => {
    let userId = req.session.user._id.toString();
    photoDB.update({userId}, {photo: []}).then(data => {
        res.send({code: 0, msg: '重置成功'});
    });
};
exports.showBoard = (req, res) => {
    let userId = req.session.user._id.toString();
    msgBoardDB.find({cUserId: userId}, {}, true).sort({created_time: -1}).then(data => {
        let result = data.map(item => {
            return new Promise(resolve => {
                userDB.find({_id: ObjectId(item.userId)}).then(data => {
                    item.currentUser = data.userName;
                    item.avater = data.avater;
                    let format = new Times(item.created_time);
                    let time = format.getDate('YY.MM.DD') + '&nbsp;&nbsp;&nbsp;' + format.getTime();
                    item.time = time;
                    resolve(item);
                })
            });
        });
        Promise.all(result).then(boardMsg => {
            res.render('myHome/messageBoard.html', {
                user: req.session.user,
                board: boardMsg
            })
        })
    });
};
exports.publishBoard = (req, res) => {
    let userId = req.session.user._id.toString();
    let cUserId = userId;
    let message = req.body.message;
    msgBoardDB.save({userId, cUserId, message}).then(res.send({code: 0, msg: '发布留言成功'}));
};
