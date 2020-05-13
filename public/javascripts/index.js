let ly = {};
ly.index = {};
//打开/关闭卡片编辑界面
ly.index.open = () => {
    $('#cardInput_button').on('click', function () {
        $('.overlay').attr('style', 'display:block;');
        $('#form_indexCard').attr('style', 'display:block;');
    });
    $('.close_btn').on('click', function () {
        $('.overlay').attr('style', 'display:none;');
        $('#form_indexCard').attr('style', 'display:none;');
    });
};
ly.index.open();

//发布卡片
ly.index.publish = () => {
    $('#indexCard_button').on('click', function (e) {
        e.preventDefault();
        let formData = new FormData($('#form_indexCard')[0]);
        $.ajax({
            type: 'post',
            url: '/index/indexCard',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: (response) => {
                console.log(response)
                if (response.code === 0) {
                    window.alert('发表成功！');
                    window.location.href = '/index';
                } else if (response.code === 1) {
                    alert('请上传一张图片！');
                }
            }
        })
    });
};
ly.index.publish();

//轮播图
ly.index.carousel = () => {
    //定义图片的索引
    var index = 0;
    //添加流阀 true说明本次单机会有响应处理
    var flag = true;
    //轮播图 下一张
    $('.next').on('click', function () {
        if (flag == true) {
            /* 设置节流阀 */
            flag = false;
            index--;
            $('.carousel_li').each(function (key, value) {
                $(this).css({
                    'transform': 'rotateX(' + (index * 90) + 'deg)',
                    'transition-delay': (key * 0.2) + 's'
                })
            });
            setTimeout(function () {
                flag = true;
            }, 1000)
        }
    });
    //轮播图 上一张
    $('.pre').on('click', function () {
        if (flag == true) {
            /* 设置节流阀 */
            flag = false;
            index++;
            $('.carousel_li').each(function (key, value) {
                $(this).css({
                    'transform': 'rotateX(' + (index * 90) + 'deg)',
                    'transition-delay': (key * 0.2) + 's'
                })
            });
            setTimeout(function () {
                flag = true;
            }, 1000)
        }
    });
};
ly.index.carousel();


ly.index.waterfall = () => {

};
ly.index.waterfall();

//渲染瀑布流
ly.index.show_waterfall = () => {
    //瀑布流算法
    function append(data) {
        $.each(data.card, function (index, value) {
            var t_img;
            var isLoad = true;

            function isImgLoad(callback) {
                $('.img').each(function () {
                    if (this.height === 0) {
                        isLoad = false;
                        return isLoad;
                    }
                });
                if (isLoad) {
                    clearTimeout(t_img);
                    callback();
                } else {
                    isLoad = true;
                    t_img = setTimeout(function () {
                        isImgLoad(callback);
                    }, 500);
                }
            }

            isImgLoad(function () {
                function count(itemId) {
                    let arr = new Array();
                    $(itemId).each(function () {
                        arr.push($(this).outerHeight(true));
                    });
                    return arr + ''
                }

                var pb1 = count('#item1');
                var pb2 = count('#item2');
                var pb3 = count('#item3');
                var pb4 = count('#item4');

                function minHeight() {
                    var minHeight = Math.min(pb1, pb2, pb3, pb4);
                    if (minHeight == pb1) {
                        return item1
                    }
                    if (minHeight == pb2) {
                        return item2
                    }
                    if (minHeight == pb3) {
                        return item3
                    }
                    if (minHeight == pb4) {
                        return item4
                    }
                }

                var item = minHeight();
                var theItem = '#' + item.id;

                var content = `<div class="item_inner" onclick="ly.index.detail(this)"><div class="card_img">
                <img src="` + value.cardImg + `"/>
                    </div>
                    <div class="item_text">
                    <span>` + value.cardDescription + `</span>
                    <div class="card_author">
                    <span class="card_avater"><img src=" ` + value.avater + ` "/> </span>
                    <span id="card_name"><a>` + value.userName + `</a></span>
                <span id="card_title"> ` + value.cardTitle + `</span>
                    <span id="card_id">` + value._id + `</span>
                    </div>
                    </div></div>`;

                $(theItem).append(content);
            });
        })
    }

    $.ajax({
        type: 'get',
        url: '/index/getCard',
        dataType: 'json',
        success: (data) => {
            append(data);
        }
    });
};
ly.index.show_waterfall();

ly.index.detail = (obj) => {
    let cardId = $(obj).find('#card_id').html();
    cardId = cardId.replace(/\"/g, "");
    $.ajax({
        url: '/index/cardDetailed',
        dataType: "json",
        type: "post",
        data: {
            cardId
        },
        success: (response) => {
            if (response.code === 0) {
                window.location.href = '/index/cardDetailed'
            }
        }
    });
};