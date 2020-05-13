const DAO = require('../../db/db').DAO;
const myFriendDB = new DAO('MyFriend');
const userDB = new DAO('User');
const chatDB = new DAO('Chat');
const ObjectId = require('mongodb').ObjectId;

exports.showFriends = (req, res) => {
    let userId = req.session.user._id.toString();
    myFriendDB.find({userId}).then(friendData => {
        let result = friendData.friends.map(item => {
            return new Promise(resolve => {
                userDB.find({_id: ObjectId(item)}).then(userData => {
                    resolve(userData)
                })
            })
        });
        Promise.all(result).then(userData => {
            req.session.friendMsg = userData;
            res.render('friends/myFriends.html', {
                user: req.session.user,
                friendMessage: req.session.friendMsg
            })
        })
    });
};
exports.del = (req, res) => {
    console.log(req.body);
    let friendId = req.body.friendId;
    let userId = req.session.user._id.toString();
    myFriendDB.update({userId}, {'$pull': {friends: friendId}})
        .then(data => {
            return myFriendDB.update({userId: friendId}, {'$pull': {friends: userId}});
        })
        .then(data => {
            res.send({code: 0, msg: '删除成功'});
        })
};
exports.showChat = (req, res) => {
    let toId = req.query.id;
    let sendId = req.session.user._id.toString();
    let toMsg;
    userDB.find({_id: ObjectId(toId)})
        .then(data => {
            toMsg = data;
            return chatDB.find({
                $or: [
                    {sendId, toId},
                    {sendId: toId, toId: sendId}
                ]
            }, {}, true);
        })
        .then(chatData => {
            res.render('friends/chat.html', {
                user: req.session.user,
                toMsg,
                record: chatData,
                friendMessage: req.session.friendMsg
            })
        })
};
