let ly = {};
ly.card = {};

ly.card.collection = (obj)=>{
    let cardId = obj.id;
    $.ajax({
        url: '/index/cardDetailed/collection',
        dataType: "json",
        type: "post",
        data: {
            cardId:cardId
        },
        success:function(response){
            if(response.code === 0){
                alert('收藏成功！')
            }
        }
    })
};