let ly = {};
ly.friends = {};
ly.friends.del = (obj)=>{
    let friendId = obj.id;
    $.ajax({
        url: '/friends/delete',
        dataType: "json",
        type: "post",
        data: {
            friendId
        },
        success:(response)=>{
            if(response.code === 0 ){
                alert('删除成功!');
                window.location.href = '/friends';
            }
        }
    })
};


