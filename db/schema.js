const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//用户信息的schema
const userSchema = new Schema({
    status:{
        type:Number,
        //是否可以评论，登录使用 0:没有权限限制 1：不可以评论 2：不可以登陆
        enum:[0,1,2],
        default:0
    },
    avater:{
        type:String,
        default:'/images/avater.png'
    },
    school:{
        type:String,
        required:true
    },
    studentNumber:{
        type:Number,
        required:true
    },
    studentName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    signature:{
        type:String,
        default:''
    },
    gender:{
        type:Number,
        enum:[-1,0,1], //-1保密 0女 1男
        default:-1
    },
    birthday:{
        type:Date,
        default:'2020-02-02'
    },
    specialty:{
        type:String,
        default:'无'
    },
    email:{
        type:String,
        default:''
    },
    introduce:{
        //个人介绍
        type:String,
        default:'无'
    },
    hobby:{
        type:Object,
        default:''
    },
    created_time:{
        type:String,
        // default:currentDate
    },
});

//主页发布状态信息的Schema
const messageSchema = new Schema({
    userId:{
        type:String
    },
    message:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        default:Date.now
    }
});

//留言板的Schema
const boardSchema = new Schema({
    //当前主页的用户Id
    userId:{
        type:String,
        required:true
    },
    //留言的用户Id
    cUserId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        default:Date.now
    }
});

//漂流卡片的Schema
const indexCardSchema = new Schema({
    cardTitle:{
        type:String,
    } ,
    cardDescription:{
        type:String,
    },
    cardImg:{
        type:String
    },
    userId:{
        type:String
    },
    created_time:{
        type:Date
    }
});

//好友的Schema
const myFriendsSchema = new Schema({
    userId:{
        type:String,
    },
    friends:{
        type:Array
    }
});

//收藏的Schema
const collectionSchema = new Schema({
    userId:{
        type:String
    },
    cardId:{
        type:String
    },
    created_time:{
        type:Date,
        default:Date.now
    }
});

//动态的Schema
const postSchema = Schema({
    userId:{
        type:String,
        default:''
    },
    message:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:''
    },
    title:{
        type:String,
        default:''
    },
    sendTo:{
        type:Array,
        default:[]
    },
    created_time:{
        type:Date,
        default:Date.now
    }
});

//聊天记录的Schema
const chatSchema = Schema({
    sendId:{
        type:String
    },
    toId:{
        type:String
    } ,
    message:{
        type:String
    },
    created_time:{
        type:Date,
        default:Date.now
    }
});

//最近访客的Schema
const visitorSchema = Schema({
    userId:{
        type:String
    },
    visitorId:{
        type:String
    },
    visitor_time:{
        type:Date,
        default:Date.now
    }
});

//照片墙的Schema
const photoWallSchema = Schema({
    userId:{
        type:String,
    },
    photo:{
        type:Array,
    }
});

//好友申请的Schema，尚未通过申请并且未拒绝添加的好友存于此
const addFriendSchema = Schema({
    sendId:{
        type:String
    },
    toId:{
        type:String
    },
});

const User = mongoose.model('User',userSchema);
const Message = mongoose.model('Message',messageSchema);
const MessageBoard = mongoose.model('MessageBoard',boardSchema);
const IndexCard = mongoose.model('IndexCard',indexCardSchema);
const MyFriend = mongoose.model('MyFriend',myFriendsSchema);
const Collection = mongoose.model('Collection',collectionSchema);
const Post = mongoose.model('Post',postSchema);
const Chat = mongoose.model('Chat',chatSchema);
const Visitor = mongoose.model('Visitor',visitorSchema);
const PhotoWall = mongoose.model('PhotoWall',photoWallSchema);
const AddFriend = mongoose.model('AddFriend',addFriendSchema);

exports.User = User;
exports.Message = Message;
exports.Board = MessageBoard;
exports.IndexCard = IndexCard;
exports.MyFriend = MyFriend;
exports.Collection = Collection;
exports.Post = Post;
exports.Chat = Chat;
exports.Visitor = Visitor;
exports.PhotoWall = PhotoWall;
exports.AddFriend = AddFriend;

