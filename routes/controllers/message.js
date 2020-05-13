const DAO = require('../../db/db').DAO;
const addFDB = new DAO('AddFriend');
const userDB = new DAO('User');
const myFriendDB = new DAO('MyFriend');
const ObjectId = require('mongodb').ObjectId;

exports.showAppli = (req, res)=> {
    let userId = req.session.user._id.toString();
    addFDB.find({toId: userId}, {}, true)
        .then(addFData => {
            let result = addFData.map(item=>{
                return new Promise(resolve => {
                    userDB.find({_id:ObjectId(item.sendId)}).then(userData=>{
                        item.userName = userData.userName;
                        item.avater = userData.avater;
                        item.signature = userData.signature;
                        resolve(item);
                    })
                });
            });
            Promise.all(result).then(appliData=>{
                res.render('message/application.html', {
                    user: req.session.user,
                    application: appliData
                })
            });
        });
};
exports.pass = (req, res)=> {
    let userId = req.session.user._id.toString();
    let sendId = req.body.sendId;
    console.log(req.body);
    myFriendDB.update({userId}, {'$push': {friends: sendId}})
        .then(data => {
            return myFriendDB.update({userId:sendId},{'$push': {friends: userId}});
        })
        .then(data => {
            addFDB.del({sendId, toId: userId}).then(data=>{
                res.send({code: 0, msg: '添加好友成功'});
            })
        })
};
