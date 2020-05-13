let ly = {};
ly.home = {};

//添加好友
ly.home.addF = (obj)=>{
    let toId = obj.id;
    $.ajax({
        url: '/home/addFriends',
        dataType: "json",
        type: "post",
        data:{
            toId
        },
        success:(response)=>{
            if(response.code === 0 ){
                alert('发送好友申请成功！')
            }else if (response.code === 1){
                alert('您已添加过该好友！')
            }else if (response.code === 2){
                alert('您已发送过好友申请！')
            }
        }
    });
};

//添加照片墙的图片
ly.home.append = (data)=>{
    $.each(data.photo,function (index,value) {
        if (data.photo.length ==  1 || data.photo.length >  1){
            $('#no_album').attr({
                style:'display:none;'
            })
        }
        content = '<img src="'+ value  + '" class="img'+index + '">'
        $('.album_img').append(content)
    })
};

//获取数据库中的图片数据，添加到页面
ly.home.getImg = ()=>{
    let friendId = $('#home_album')[0].href.toString().split('=')[1];
    $.ajax({
        url:'/home/photo',
        type:'get',
        data:{
            friendId
        },
        success:function (data) {
            ly.home.append(data);
        }
    });
};
ly.home.getImg();

//发布留言
ly.home.boardPublish = ()=>{
    $('#MB_btn').on('click',function (e) {
        e.preventDefault();
        let friendId = $('#home_album')[0].href.toString().split('=')[1];
        let message = $('#MB_message').val();
        $.ajax({
            url:'/home/messageBoard',
            type:'post',
            data:{
                friendId,
                message
            },
            dataType:'json',
            success:(response)=>{
                if(response.code === 0){
                    alert('发表成功！');
                    window.location.href = '/home/messageBoard?id='+friendId;
                }
            }
        })
    });
};
ly.home.boardPublish();



