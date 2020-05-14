const DAO = require('../../db/db').DAO;
const userDB = new DAO('User');
const msgDB = new DAO('Message');
const visitorDB = new DAO('Visitor');
const photoDB = new DAO('PhotoWall');
const msgBoardDB = new DAO('Board');
const friendDB = new DAO('MyFriend');
const addFDB = new DAO('AddFriend');
const ObjectId = require('mongodb').ObjectId;
const Times = require('../../main/main').Time;

exports.showHome = (req, res) => {
    let friendId = req.query.id;
    let userId = req.session.user._id.toString();
    let friendData, msgData;
    let obj = {
        visitorId: userId,
        userId: friendId
    };
    userDB.find({_id: ObjectId(friendId)})
        .then(friendData => {
            return new Promise(resolve => {
                resolve(friendData);
            })
        })
        .then(data => {
            req.session.friendData = data;
            return new Promise(resolve => {
                msgDB.find({userId: friendId}, {}, true).sort({created_time: -1}).then(msgData => {
                    let result = msgData.map(item => {
                        return new Promise(resolve => {
                            let format = new Times(item.created_time);
                            let time = format.getDate('YY.MM.DD') + '&nbsp;&nbsp;&nbsp;' + format.getTime();
                            item.time = time;
                            resolve(item);
                        });
                    });
                    resolve(result);
                })
            })
        })
        .then(result => {
            Promise.all(result).then(data => {
                msgData = data;
            });
            return visitorDB.find(obj)
        })
        .then(data => {
            if (data) {
                return new Promise(resolve => {
                    visitorDB.del(obj).then(data => {
                        visitorDB.save(obj).then(data => {
                            resolve('ok')
                        })
                    })
                });
            } else {
                return new Promise(resolve => {
                    visitorDB.save(obj).then(data => {
                        resolve('ok')
                    })
                });
            }
        })
        .then(data => {
            return new Promise(resolve => {
                visitorDB.find({userId: friendId}, {}, true).sort({visitor_time: -1}).then(visitorData => {
                    let result = visitorData.map(item => {
                        return new Promise(resolve => {
                            userDB.find({_id: ObjectId(item.visitorId)}).then(data => {
                                item.avater = data.avater;
                                resolve(item);
                            })
                        })
                    });
                    resolve(result);
                });
            });
        })
        .then(result => {
            Promise.all(result).then(visitorData => {
                res.render('home/home.html', {
                    user: req.session.user,
                    friendData: req.session.friendData,
                    message: msgData,
                    visitors: visitorData
                })
            })
        })
};
exports.addF = (req, res) => {
    let userId = req.session.user._id.toString();
    let friendId = req.body.toId;
    friendDB.find({userId, friends: friendId})
        .then(data => {
            if (data) {
                res.send({code: 1, msg: '您已经添加过该好友'});
            } else {
                return addFDB.find({sendId: userId, toId: friendId})
            }
        })
        .then(data => {
            if (data) {
                res.send({code: 2, msg: '您已发送过好友申请'});
            } else {
                addFDB.save({sendId: userId, toId: friendId}).then(data => {
                    res.send({code: 0, msg: '发送申请成功'});
                })
            }
        })
};
exports.showAlbum = (req, res) => {
    res.render('home/album.html', {
        user: req.session.user,
        friendData: req.session.friendData
    })
};
exports.getPhoto = (req, res) => {
    let friendId = req.query.friendId;
    photoDB.find({userId: friendId}).then(data => {
        res.send({code: 0, msg: '获取照片成功', photo: data.photo});
    });
};
exports.showBoard = (req, res) => {
    let friendId = req.query.id;
    msgBoardDB.find({cUserId: friendId}, {}, true).sort({created_time: -1})
        .then(boardData => {
            let result = boardData.map(item => {
                return new Promise(resolve => {
                    let format = new Times(item.created_time);
                    let time = format.getDate('YY.MM.DD') + '&nbsp;&nbsp;&nbsp;' + format.getTime();
                    item.time = time;
                    userDB.find({_id: ObjectId(item.userId)}).then(userData => {
                        item.avater = userData.avater;
                        item.userName = userData.userName;
                        resolve(item);
                    });
                })
            });
            Promise.all(result).then(boardData => {
                res.render('home/messageBoard.html', {
                    user: req.session.user,
                    friendData: req.session.friendData,
                    board: boardData
                });
            })
        });
};
exports.publishBoard = (req, res) => {
    let userId = req.session.user._id.toString();
    let cUserId = req.body.friendId;
    let message = req.body.message;
    msgBoardDB.save({userId, cUserId, message}).then(data => {
        res.send({code: 0, msg: '发布留言成功'})
    });
};
