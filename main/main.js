class Time {
    constructor(date) {
        this.date = date;
    }

    getDate(format) {
        const config = {
            YY: this.date.getFullYear(),
            MM: ('0' + (this.date.getMonth() + 1)).slice(-2),
            DD: ('0' + this.date.getDate()).slice(-2),
        };
        for (const key in config) {
            format = format.replace(key,config[key])
        }
        return format;
    }
    getTime(){
        let hour = ('0' + this.date.getHours()).slice(-2);
        let mimutes = ('0' + this.date.getMinutes()).slice(-2);
        return hour + '：'+mimutes;
    }
    getWeek(){
        let week = this.date.getDay();
        switch(week){
            case 1:
                week = '星期一';
                break;
            case 2:
                week = '星期二';
                break;
            case 3:
                week = '星期三';
                break;
            case 4:
                week = '星期四';
                break;
            case 5:
                week = '星期五';
                break;
            case 6:
                week = '星期六';
                break;
            case 0:
                week = '星期日';
                break;
        }
        return week;
    }
}
class CurrentTime extends Time{
    constructor() {
        super();
        this.date = new Date();
    }
    currentDate(){
        return super.getDate('YY.MM.DD');
    }
    currentTime(){
        return super.getTime();
    }
    currentWeek(){
        return super.getWeek();
    }
}

function connect(server){
    const DAO = require('../db/db').DAO;
    const chatDB = new DAO('Chat');
    const io = require('socket.io')(server);
    const _ = require('underscore');
    io.on('connection', client=> {
        console.log('用户进入房间');
        client.on('setName', msg=> {
            client.toId = msg.toId;
            client.sendId = msg.sendId;
        });
        client.on('sayTo', msg => {
            let sendId = msg.sendId;
            let toId = msg.toId;
            let message = msg.message;
            let toSocket = _.findWhere(io.sockets.sockets,{sendId:toId});
            //判断我想要请求通信的friend是否打开了chat窗口
            if (toSocket) {
                //判断friend的窗口指向
                let socketToId = toSocket.toId;
                //如果指向我，有socket响应，否则进入留言状态
                if (socketToId === client.sendId) {
                    toSocket.emit('msg_to',message);
                    client.emit('msg_my',message);
                    chatDB.save({sendId,toId,message})
                }else{
                    //对方窗口指向其他人
                    client.emit('msg_my',message);
                    chatDB.save({sendId,toId,message})
                }
            }else{
                //对方窗口未打开
                client.emit('msg_my',message);
                chatDB.save({sendId,toId,message})
            }
        });
        client.on('disconnect', function () {
            console.log('客户端已断开连接');
        });
    });
}


exports.Time = Time;
exports.CurrentTime=CurrentTime;
exports.chatRoom = connect;