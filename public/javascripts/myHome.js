let ly = {};
ly.myHome = {};
//主页动态发布
ly.myHome.publish = ()=>{
    $('#form_home').on('submit',function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url:'/myHome/myHome',
            type:'post',
            data:formData,
            dataType:'json',
            success:(response)=>{
                if(response.code === 0){
                    alert('发表成功！');
                    window.location.href = '/myHome';
                }
            }
        })
    });
};
ly.myHome.publish();

//监听img的change，一改变就上传图片，存入数据库
ly.myHome.change = ()=>{
    $('#upImg').change(function () {
        let formData = new FormData();
        formData.append('photo',$('#upImg')[0].files[0]);
        $.ajax({
            url:'/myHome/album',
            type:'post',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            success:(response)=>{
                if(response.code === 0){
                    window.location.href = '/myHome/album';
                }else if (response.code === 1){
                    alert('已达到添加上限！');
                }
            }
        })
    });
};
ly.myHome.change();

//添加照片墙的图片
ly.myHome.append = (data)=>{
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
ly.myHome.show = ()=>{
    $.ajax({
        url:'/myHome/photo',
        type:'get',
        success:function (data) {
            ly.myHome.append(data)
        }
    });
};
ly.myHome.show();

//重置照片墙
ly.myHome.reset = ()=>{
    $.ajax({
        url:'/myHome/reset',
        type:'get',
        success:(response)=>{
            if (response.code === 0){
                alert('重置成功!');
                window.location.href = '/myHome/album';
            }
        }
    })
};

//发布留言
ly.myHome.boardPublish = ()=>{
    $('#form_board').on('submit',function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url:'/myHome/messageBoard',
            type:'post',
            data:formData,
            dataType:'json',
            success:function(response){
                if(response.code === 0){
                    window.alert('发表成功！');
                    window.location.href = '/myHome/messageBoard';
                }
            }
        })
    });
};
ly.myHome.boardPublish();