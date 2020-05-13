const express = require('express');
const router = express.Router();
const DAO = require('../../db/db').DAO;
const colDB = new DAO('Collection');
const cardDB = new DAO('IndexCard');
const userDB = new DAO('User');
const Times = require('../../main/main').Time;
const ObjectId = require('mongodb').ObjectId;

exports.showCol = (req, res) => {
    let userId = req.session.user._id.toString();
    colDB.find({userId}, {}, true)
        .then(col => {
            let result = col.map(item => {
                return new Promise(resolve => {
                    cardDB.find({_id: ObjectId(item.cardId)}).then(cardData => {
                        resolve(cardData)
                    })
                })
            });
            Promise.all(result).then(cardData => {
                let result = cardData.map(item => {
                    return new Promise(resolve => {
                        let format = new Times(item.created_time);
                        let time = format.getDate('YY年MM月DD日') + '&nbsp' + format.getTime();
                        item.time = time;
                        userDB.find({_id: ObjectId(item.userId)}).then(userData => {
                            item.userName = userData.userName;
                            resolve(item);
                        })
                    })
                });
                Promise.all(result).then(colData => {
                    res.render('collection/collection', {
                        user: req.session.user,
                        collection: colData
                    })
                })
            })
        });
};
exports.del = (req, res) => {
    console.log(req.body);
    let colId = req.body.colId;
    colDB.del({cardId: colId}).then(data => {
        res.send({code: 0, msg: '删除收藏成功'})
    });
};

// //渲染收藏页面
// router.get('/',function (req,res) {
//     let userId = req.session.user._id.toString();
//     colDB.find({userId},{},true)
//         .then(col => {
//             let result = col.map(item=>{
//                 return new Promise(resolve => {
//                     cardDB.find({_id:ObjectId(item.cardId)}).then(cardData=>{
//                         resolve(cardData)
//                     })
//                 })
//             });
//             Promise.all(result).then(cardData=>{
//                 let result = cardData.map(item=>{
//                     return new Promise(resolve => {
//                         let format = new Times(item.created_time);
//                         let time = format.getDate('YY年MM月DD日') + '&nbsp' + format.getTime();
//                         item.time = time;
//                         userDB.find({_id:ObjectId(item.userId)}).then(userData=>{
//                             item.userName = userData.userName;
//                             resolve(item);
//                         })
//                     })
//                 });
//                 Promise.all(result).then(colData=>{
//                     res.render('collection/collection', {
//                         user: req.session.user,
//                         collection: colData
//                     })
//                 })
//             })
//         });
// });
//
// //删除收藏
// router.post('/delete',function (req,res) {
//     console.log(req.body);
//     let colId = req.body.colId;
//     colDB.del({cardId:colId}).then(data=>{res.send({code:0,msg:'删除收藏成功'})});
// });
//
//
// module.exports = router;