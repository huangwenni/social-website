let ly = {};
ly.per = {};

//更改信息
ly.per.modify = ()=>{
    $('#form_myMessage').on('submit',function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url:'/personal/message',
            type:'post',
            data:formData,
            dataType:'json',
            success:(response)=>{
                if(response.code === 0){
                    alert('修改成功！');
                    window.location.href = '/personal/message';
                }
            }
        })
    })
};
ly.per.modify();

//使用cropper插件 上传头像
ly.per.cropper = ()=>{
    //使用cropper插件
    const initCropper = function (img, input){
        let $image = img;
        let options = {
            aspectRatio: 1/1, // 纵横比
            autoCropArea: 1,
            preview: '.img_preview' // 预览图的class名
        };
        $image.cropper(options);
        let $inputImage = input;
        let uploadedImageURL;
        if (URL) {
            // 给input添加监听
            $inputImage.change(function () {
                let files = this.files;
                let file;
                if (!$image.data('cropper')) {
                    return;
                }
                if (files && files.length) {
                    file = files[0];
                    // 判断是否是图像文件
                    if (/^image\/\w+$/.test(file.type)) {
                        // 如果URL已存在就先释放
                        if (uploadedImageURL) {
                            URL.revokeObjectURL(uploadedImageURL);
                        }
                        uploadedImageURL = URL.createObjectURL(file);
                        // 销毁cropper后更改src属性再重新创建cropper
                        $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                        $inputImage.val('');
                    } else {
                        alert('请选择一个图像文件！');
                    }
                }
            });
        } else {
            $inputImage.prop('disabled', true).addClass('disabled');
        }
    };
    initCropper($('.inner_img'),$('#input_avater'));
};
ly.per.cropper();

ly.per.upImg = ()=>{
    let $image = $('.inner_img');
    $image.cropper('getCroppedCanvas',{
        width:300, // 裁剪后的长宽
        height:300
    }).toBlob(function(blob){
        let formData = new FormData();
        formData.append("file", blob, 'avaterImg');
        $.ajax({
            type:'post',
            url:'/personal/avater',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            success:(response)=>{
                if(response.code === 0){
                    window.location.href ='/personal/avater';
                    alert('更新成功！')
                }
            }
        })
    });
};

