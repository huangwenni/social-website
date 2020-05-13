const fs = require('fs');
const DAO = require('../../db/db').DAO;
const userDB = new DAO('User');
const cardDB = new DAO('IndexCard');
const myFriendDB = new DAO('MyFriend');
const postDB = new DAO('Post');
const collectionDB = new DAO('Collection');
const Times = require('../../main/main').Time;
const ObjectId = require('mongodb').ObjectId;

exports.showIndex = (req, res, next) => {
    if (req.session.user === null) {
        res.render('error');
    } else {
        let userId = req.session.user._id;
        userDB.find({_id: userId}).then(data => {
            res.render('index', {user: data});
        });
    }
};
exports.getCardData = (req, res) => {
    cardDB.find({}, {}, true).then(data => {
        let result = data.map(item => {
            return new Promise(resolve => {
                userDB.find({_id: item.userId}).then(data => {
                    item._doc.userName = data.userName;
                    item._doc.avater = data.avater;
                    resolve(item);
                })
            })
        });
        Promise.all(result).then(result => {
            res.json({card: result});
        });
    });
};
exports.publishCard = (req, res) => {
    let file_type;
    if (req.file && req.file.mimetype.split('/')[0] == 'image') {
        file_type = '.' + req.file.mimetype.split('/')[1];
    }
    if (file_type) {
        fs.rename(req.file.path, req.file.path + file_type, err => {
            if (err) throw err;
            let path = '/images/upImgs/' + req.file.filename + file_type;
            let body = req.body;
            let userId = req.session.user._id.toString();
            body.cardImg = path;
            body.userId = userId;
            body.created_time = new Date();
            cardDB.save(body);
            myFriendDB.find({userId}, {}, true).then(data => {
                if (data.friends) {
                    postDB.save({
                        userId: body.userId,
                        message: body.cardDescription,
                        img: body.cardImg,
                        title: body.cardTitle,
                        sendTo: data.friends
                    }).then(data => {
                        res.send({code: 0, msg: '发布成功'});
                    })
                } else {
                    res.send({code: 0, msg: '发布成功'});
                }
            });
        });
    } else {
        res.send({code: 1, msg: '请上传一张图片'});
    }
};
exports.getCardDetailed = (req, res, next) => {
    cardDB.find({_id: ObjectId(req.body.cardId)})
        .then(data => {
            let cardData = data;
            userDB.find({_id: ObjectId(data.userId)})
                .then(data => {
                    cardData._doc.userName = data.userName;
                    return new Promise(resolve => {
                        resolve(cardData);
                    })
                })
                .then(cardData => {
                    let format = new Times(cardData.created_time);
                    cardData._doc.time = format.getDate('YY.MM.DD') + '&nbsp;&nbsp;&nbsp;' + format.getTime();
                    req.session.cardData = cardData;
                    res.send({code: 0, msg: '请求卡片数据成功'});
                });
        })
};
exports.showCardDetailed = (req, res, next) => {
    res.render('index/cardDetailed', {
        user: req.session.user,
        cardDetailed: req.session.cardData
    });
};
exports.cardCol = (req, res, next) => {
    let cardId = req.body.cardId;
    let userId = req.session.user._id.toString();
    collectionDB.save({userId, cardId}).then(data => res.send({code: 0, msg: '收藏成功'}));
};