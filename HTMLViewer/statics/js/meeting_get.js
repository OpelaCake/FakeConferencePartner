function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}
$(document).ready(function() {
    // 发送 POST 请求获取会议数据
    username = getCookie('username')
    $.ajax({
        type: 'POST',
        url: 'renderMeetingsList',
        contentType: 'application/json',
        data: JSON.stringify({ page: 1, numper: 10, username: username }),
        success: function(data) {
            if (data.messageData && data.messageData.length > 0) {
                data.messageData.forEach(function(meeting) {
                    var meetingRow = '<tr data-id="' + meeting.id + '">' +
                        '<td>' + meeting.name + '</td>' +
                        '<td>' + meeting.shortname + '</td>' +
                        '<td>' + meeting.due_date + '</td>' +
                        '<td>' + meeting.info_date + '</td>' +
                        '<td>' + meeting.meeting_date + '</td>' +
                        '<td>' + meeting.location + '</td>' +
                        '<td>' + meeting.CCF_level + '</td>' +
                        '<td>' + meeting.CORE_level + '</td>' +
                        '<td>' + meeting.QUALIS_level + '</td>' +
                        '<td><button class="btn btn-primary follow-btn">关注</button></td>' +
                        '</tr>';
                        if (meeting.followed) {
                            meetingRow = meetingRow.replace('<button class="btn btn-primary follow-btn">关注</button>', '<button class="btn btn-danger unfollow-btn">取消关注</button>');
                        }
                    $('#meetingsList').append(meetingRow);
                });

                // 给每个关注按钮添加点击事件
                $('.follow-btn').click(function() {
                    var meetingId = $(this).closest('tr').data('id');
                    followMeeting(meetingId, true, $(this));
                });
                // 取关
                $('.unfollow-btn').click(function() {
                    var meetingId = $(this).closest('tr').data('id');
                    followMeeting(meetingId, false, $(this));
                });
            } else {
                $('#meetingsList').append('<tr><td colspan="10">暂无会议信息</td></tr>');
            }
        },
        error: function(xhr, status, error) {
            console.error("获取会议数据失败:", error);
            $('#meetingsList').append('<tr><td colspan="10">获取会议信息失败</td></tr>');
        }
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
                        btn.text('取消关注').removeClass('btn-secondary follow-btn').addClass('btn-danger unfollow-btn');
                        alert("会议关注成功！");
                        btn.prop('disabled', false)
                    } else {
                        btn.text('关注').removeClass('btn-secondary unfollow-btn').addClass('btn-primary follow-btn');
                        alert("会议取关成功。");
                        btn.prop('disabled', false)
                    }
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