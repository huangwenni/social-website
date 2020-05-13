let ly = {};
ly.msg = {};

ly.msg.pass = (obj)=>{
    let sendId = obj.id;
    $.ajax({
        url:'/message/pass',
        type:'post',
        data: {
            sendId
        },
        success:(response)=> {
            if (response.code === 0){
                alert('添加好友成功!');
                window.location.href = '/message/application';
            }
        }
    })
};
