const express = require('express');
const router = express.Router();

//上传图片文件
const multer = require('multer');
const upImg = multer({dest: '../public/images/upImgs'});
const upAlbum = multer({dest: '../public/images/upAlbum'});
const upAvater = multer({dest: '../public/images/upAvater'});
const postImg = multer({dest: '../public/images/postImg'});

//路由文件
const sign = require('./controllers/login');
const index = require('./controllers/index');
const myHome = require('./controllers/myHome');
const home = require('./controllers/home');
const friends = require('./controllers/friends');
const col = require('./controllers/collection');
const per = require('./controllers/personal');
const msg = require('./controllers/message');
const post = require('./controllers/post');


//login 登陆、注册、退出
router.get('/', sign.showLogin);//渲染登陆页面
router.post('/login', sign.login);//登陆
router.get('/register', sign.showRegister);//渲染注册页面
router.post('/register', sign.register);//注册
router.get('/interest/:name', sign.showInterest);//渲染兴趣偏好页面
router.post('/interest', sign.interest);//上传兴趣偏好
router.get('/logout', sign.logout);//退出

//index
router.get('/index', index.showIndex);//渲染index页面
router.get('/index/getCard', index.getCardData);//获取卡片数据
router.post('/index/indexCard', upImg.single('cardImg'), index.publishCard);//发布卡片
router.post('/index/cardDetailed', index.getCardDetailed);//获取卡片详情数据
router.get('/index/cardDetailed', index.showCardDetailed);//渲染卡片详情页面
router.post('/index/cardDetailed/collection', index.cardCol);//收藏卡片

//myHome
router.get('/myHome', myHome.showMyHome);//渲染我的主页页面
router.post('/myHome/myHome', myHome.publishPost);//发布动态
router.get('/myHome/album', myHome.showAlbum);//渲染album页面
router.post('/myHome/album', upAlbum.single('photo'), myHome.upPhoto);//上传照片
router.get('/myHome/photo', myHome.getPhoto);//获取照片
router.get('/myHome/reset', myHome.resetPhoto);//重置照片
router.get('/myHome/messageBoard', myHome.showBoard);//渲染留言板页面
router.post('/myHome/messageBoard', myHome.publishBoard);//发布留言

//home
router.get('/home', home.showHome);//渲染home页面
router.post('/home/addFriends', home.addF);//添加好友
router.get('/home/album', home.showAlbum);//渲染照片墙
router.get('/home/photo', home.getPhoto);//请求照片
router.get('/home/messageBoard', home.showBoard);//渲染留言板
router.post('/home/messageBoard', home.publishBoard);//发布留言

//friends
router.get('/friends', friends.showFriends);//渲染好友页面
router.post('/friends/delete', friends.del);//删除好友
router.get('/friends/chat', friends.showChat);//渲染私信页面

//collection
router.get('/collection', col.showCol);//渲染收藏页面
router.post('/collection/delete', col.del);//删除收藏

//personal
router.get('/personal/message', per.showPer);//渲染我的信息页面
router.post('/personal/message', per.modify);//修改个人信息
router.get('/personal/avater', per.showAvater);//渲染我的头像页面
router.post('/personal/avater', upAvater.single('file'), per.modifyAvater);//修改个人头像
router.get('/personal/safe', per.showSafe);//渲染账号安全页面
router.get('/personal/record', per.showRecord);//渲染登陆记录页面

//message
router.get('/message/application', msg.showAppli);//渲染好友申请页面
router.post('/message/pass', msg.pass);//通过好友申请

//post
router.get('/post', post.showPost);//渲染post页面
router.post('/post/post', postImg.single('img'), post.publishPost);//发布动态

module.exports = router;








