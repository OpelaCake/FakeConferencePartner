// 定义全局变量保存登录状态信息
var loginInfo = {
    isLoggedIn: false,
    username: ""
};

// 页面加载完成时执行的函数
$(document).ready(function() {
    $.ajax({
        url: 'statics/htmls/navbar.html',
        async: false, // 将async参数设置为false
        success: function(data) {
            $('#navbarPlaceholder').html(data); // 加载成功后插入到指定位置
        },
        error: function(xhr, status, error) {
            console.error('导航栏加载失败', error);
        }
    });
    // 检查是否存在有效的 username Cookie
    var username = getCookie("username");
    console.log("getusername:"+username)
    if (username) {
        // 如果存在有效的 username Cookie，则显示“我的账户”导航栏
        $('#myAccount').show();
        // 将登录按钮替换为用户名`
        $('#HtmlloginBtn').text(username).show();
    } else {
        // 如果不存在有效的 username Cookie，则隐藏“我的账户”导航栏
        $('#myAccount').hide();
        // 显示登录按钮
        $('#HtmlloginBtn').show();
        RegisterLogin();
    }

    
});

// 获取指定名称的 Cookie 值
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}
function RegisterLogin() {
    $('#HtmlloginBtn').click(function() {
        // 如果未登录，则跳转到登录页面
        if (!loginInfo.isLoggedIn) {
            window.location.href = "login";
        }
    });
}