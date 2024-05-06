

$(document).ready(function() {
    $('.follow-button').click(function() {
        var meetingId = $(this).data('meeting-id');  // 使用 jQuery 的 data 方法获取会议ID
        var followed = $(this).data('follow-status');  // 获取关注状态
        var shouldFollow = followed == true ? false : true;
        console.log($(this))
        console.log(shouldFollow)
        followMeeting(meetingId, shouldFollow, $(this));
    });
});

function followMeeting(meetingId, follow, btn) {
    // 检查是否登录
    if (!loginInfo.isLoggedIn) {
        // 如果未登录，重定向到登录页面
        window.location.href = '/login';
    } else {
        // 操作前，设置按钮为不可点击状态和改变颜色为灰色
        btn.prop('disabled', true).addClass('btn-secondary').removeClass('btn-primary btn-danger');

        // 如果已登录，发送关注会议的请求
        $.ajax({
            type: 'POST',
            url: '/handleMeetingFollow',
            contentType: 'application/json',
            data: JSON.stringify({
                username: loginInfo.username,
                meetingId: meetingId,
                follow: follow
            }),
            success: function(response) {
                if (response.success) {
                    console.log('关注/取关成功', response);
                    // 根据操作类型更换按钮状态和类
                    if (follow) {
                        btn.text('取消关注').removeClass('btn-secondary follow-btn').addClass('btn-danger unfollow-btn').attr('data-follow-status','true');
                        alert("会议关注成功！");
                        btn.prop('disabled', false)
                    } else {
                        btn.text('关注').removeClass('btn-secondary unfollow-btn').addClass('btn-primary follow-btn').attr('data-follow-status','false');
                        alert("会议取关成功。");
                        btn.prop('disabled', false)
                    }
                    // window.location.reload()
                } else {
                    // 失败则恢复按钮原状态
                    alert("关注/取关会议失败，请重试！");
                    btn.prop('disabled', false).removeClass('btn-secondary').addClass(follow ? 'btn-primary' : 'btn-danger');
                }
            },
            error: function(xhr, status, error) {
                alert("关注/取关会议失败，请重试！");
                btn.prop('disabled', false).removeClass('btn-secondary').addClass(follow ? 'btn-primary' : 'btn-danger');
            }
        });
    }
}
