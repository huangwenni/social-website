let ly = {};
/* 登陆、注册、退出 */
ly.login = {};
ly.login.login = () => {
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        if ($('#login_name').val() === '' || $('#login_password').val() === '') {
            alert('昵称或密码不能为空！')
        } else {
            let formData = $(this).serialize();
            $.ajax({
                url: '/login',
                type: 'post',
                data: formData,
                dataType: 'json',
                success: (response) => {
                    if (response.code === 0) {
                        window.alert('登录成功！');
                        window.location.href = '/index';
                    } else if (response.code === 1) {
                        window.alert('昵称或密码错误！')
                    }
                }
            })
        }
    })
};
ly.login.login();

ly.login.register = () => {
    $('#form_register').on('submit', function (e) {
        e.preventDefault();
        let userName = $('#userName').val();
        let studentNumber = $('#number').val();
        let password = $('#password').val();
        //学号必须是数字
        let numberReg = /^[1-9]+[0-9]*]*$/;
        //密码大于6位 且由数字或字母组成
        let passwordReg = /^[0-9A-Za-z]{7,}$/;
        if (!numberReg.test(studentNumber)) {
            alert('学号必须是数字！')
        } else if (!passwordReg.test(password)) {
            alert('密码必须由大于6位的字母或数字组成！')
        } else {
            let formData = $(this).serialize();
            $.ajax({
                url: '/register',
                type: 'post',
                data: formData,
                dataType: 'json',
                success: (response) => {
                    if (response.code === 1) {
                        window.alert('学号或昵称已存在！')
                    } else if (response.code === 0) {
                        window.alert('注册成功！');
                        window.location.href = `/interest/${userName}`
                    }
                }
            })
        }
    })
};
ly.login.register();

ly.login.interest = () => {
    //选择和取消选择
    $('.item_text').on('click', function () {
        let text = $(this).text();
        if (!$(this).hasClass('selected')) {
            //没有selected，可选择
            $(this).toggleClass('selected');
            $('#category').text(text);
            $(this).parents('#interest_card').siblings('.score').css('display', 'block');
            $('.love').css('color', 'rgba(103, 0, 0, 0.29)');
        } else {
            //取消选择
            $(this).toggleClass('selected');
            delete hobby[text];
        }
    });

    //将选中的爱好和得分包装成对象
    let score;
    let category;
    let hobby = {};
    $('.love').on('click', function () {
        $(this).css('color', '#670000');
        $(this).parent().siblings().children('a').css('color', 'rgba(103, 0, 0, 0.29)');
        score = $(this).siblings().text();
        category = $(this).parents('.score').find('#category').text();
        hobby[category] = score;
    });

    //点击确认显示出对应的得分
    $('#confirm').on('click', function () {
        $(this).parent().css('display', 'none');
        for (let key in hobby) {
            $('.item_text:contains("' + key + '")').parent().append(`
                    <div class="show_score">
                        <span>${hobby[key]}</span>
                    </div>`);
        }
    });

    //关闭喜好程度选择界面
    $('#like_close').on('click', function () {
        $(this).parent().css('display', 'none');
    });

    //上传数据
    $('#upHobby').on('click', function () {
        let url = window.location.href;
        let userName = url.substring(url.lastIndexOf('/') + 1, url.length);
        hobby = JSON.stringify(hobby);
        $.ajax({
            url: '/interest',
            type: 'post',
            data: {
                userName,
                hobby
            },
            success: function (response) {
                if (response.code === 0) {
                    alert('提交成功！');
                    window.location.href = '/';
                }
            }
        })
    })
};
ly.login.interest();