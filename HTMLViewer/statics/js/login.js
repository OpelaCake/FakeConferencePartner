$(document).ready(function() {
    // 注册按钮点击事件
    $('#ToRegisterBtn').click(function() {
        // 隐藏登录卡片，显示注册卡片
        $('#registerCard').show();
        $('.card:first').hide();
    });
    $('#returnLoginBtn').click(function() {
        // 隐藏登录卡片，显示注册卡片
        $('#registerCard').hide();
        $('.card:first').show();
    });
    
    // 登录按钮点击事件
    $('#loginBtn').click(function(event) {
        event.preventDefault(); // 阻止默认表单提交行为

        // 获取用户名和密码
        var username = $('#logusername').val();
        var password = $('#password').val();
        var rememberMe = $('#rememberMe').is(":checked");

        // 构造登录请求的数据对象
        var loginData = {
            username: username,
            password: password,
            rememberMe: rememberMe
        };
        console.log(loginData)
        // 发送登录请求
        $.ajax({
            type: 'POST',
            url: '/handleLoginForm', // 替换为实际的登录接口地址
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response) {
                if (response.success){
                    // 登录成功后的处理
                    console.log('登录成功', response);
                    // 执行其他操作，如跳转页面等
                    window.location.href = '/';
                }else{
                    console.log('登录失败', response);
                    alert("错误用户名或密码")
                }
            },
            error: function(xhr, status, error) {
                console.log("网络失败")
            }
        });
    });

    // 注册按钮点击事件
    $('#registerBtn').click(function(event) {
        event.preventDefault(); // 阻止默认表单提交行为

        // 获取注册信息
        var regUsername = $('#regUsername').val();
        var regPassword = $('#regPassword').val();
        var confirmPassword = $('#confirmPassword').val();
        var email = $('#email').val();

        // 构造注册请求的数据对象
        var registerData = {
            username: regUsername,
            password: regPassword,
            confirmPassword: confirmPassword,
            email: email
        };

        // 发送注册请求
        console.log(registerData)
        $.ajax({
            type: 'POST',
            url: '/handleRegistrationForm', // 替换为实际的注册接口地址
            contentType: 'application/json',
            data: JSON.stringify(registerData),
            success: function(response) {
                if (response.success){
                    console.log('注册成功', response);
                    alert("注册成功，返回登录")
                    window.location.href = '/login';
                }else{
                    // 注册失败后的处理
                    console.error('注册失败', error);
                    alert("注册失败")
                    // 执行其他操作，如显示错误消息等
                }
            },
            error: function(xhr, status, error) {
                console.log("网络失败")
            }
        });
    });
});

