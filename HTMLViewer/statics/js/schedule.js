var currentYear = new Date().getFullYear(); // 当前年份
var currentMonth = new Date().getMonth(); // 当前月份，从0开始计数
var alldayschedules = []
$(document).ready(function() {
    if (!getCookie("username")) window.location.href='/login'

    fillYearAndMonthSelectors();
    generateCalendar();

    // 监听年份和月份选择器的变化
    $('#yearSelector, #monthSelector').change(function() {
        currentYear = parseInt($('#yearSelector').val());
        currentMonth = parseInt($('#monthSelector').val());
        generateCalendar(); // 重新生成日历
    });
    registerAddSchedule();
});

function registerAddSchedule(){
    // 监听保存按钮的点击事件
    $("#planModal .btn-primary").click(function() {
        // 获取输入的数据
        username = getCookie("username");
        if (!username) window.location.href='/login'
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var planDetails = $("#planDetails").val();

        // 输出获取的数据到控制台（或进行其他操作，如AJAX请求）
        console.log("开始日期: " + startDate);
        console.log("结束日期: " + endDate);
        console.log("规划详情: " + planDetails);

        var color = $("#colorPicker").val(); // 获取颜色选择器的值
        // 示例：发送数据到服务器
        $.ajax({
            url: '/handleScheduleUpdate', // 替换为你的实际URL
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                start_date: startDate,
                end_date: endDate,
                schedule_info: planDetails,
                color: color,
                update_type: 0,
                update_info: "增加规划"
            }),
            success: function(response) {
                console.log('规划保存成功', response);
                if (response.success){
                    alert("规划添加成功");
                    window.location.reload()
                }
                alert("保存规划失败")
            },
            error: function(error) {
                console.error('保存规划失败', error);
            }
        });
    });
}

function generateCalendar() {
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 当前月的天数
    var firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 当前月第一天是周几

    var calendarHtml = ''; // 用于存放生成的日历HTML代码
    calendarHtml += '<div class="calendar-day-header" style="border-bottom: 1px solid #ccc;">周日</div>'
    calendarHtml += '<div class="calendar-day-header" style="border-bottom: 1px solid #ccc;">周一</div>'
    calendarHtml += '<div class="calendar-day-header" style="border-bottom: 1px solid #ccc;">周二</div>'
    calendarHtml += '<div class="calendar-day-header" style="border-bottom: 1px solid #ccc;">周三</div>'
    calendarHtml += '<div class="calendar-day-header" style="border-bottom: 1px solid #ccc;">周四</div>'
    calendarHtml += '<div class="calendar-day-header" style="border-bottom: 1px solid #ccc;">周五</div>'
    calendarHtml += '<div class="calendar-day-header" style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;">周六</div>' 
    let counter = 0;
    for (let i = 0; i < firstDay; i++) {
        counter++;
        calendarHtml += '<div class="calendar-day">-</div>'; // 月初前的空白天
    }
    for (let day = 1; day <= daysInMonth; day++) {
        counter++;
        if (counter%7==0){
            if (counter>=29)
            calendarHtml += '<div data-date="'+currentYear+'-'+(currentMonth+1)+'-'+day+'" class="calendar-day" style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;">' + day + '</div>'; // 实际的日历天数
            else
                calendarHtml += '<div data-date="'+currentYear+'-'+(currentMonth+1)+'-'+day+'" class="calendar-day" style="border-right: 1px solid #ccc;">' + day + '</div>'; // 实际的日历天数
        }else{
            if (counter>=29)
            calendarHtml += '<div data-date="'+currentYear+'-'+(currentMonth+1)+'-'+day+'" class="calendar-day" style="border-bottom: 1px solid #ccc;">' + day + '</div>'; // 实际的日历天数
            else
            calendarHtml += '<div data-date="'+currentYear+'-'+(currentMonth+1)+'-'+day+'" class="calendar-day">' + day + '</div>'; // 实际的日历天数
        }
    }
    while (counter<35){
        counter++;
        if (counter%7==0){
            if (counter>=29)
            calendarHtml += '<div class="calendar-day" style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;">-</div>'; // 实际的日历天数
            else
            calendarHtml += '<div class="calendar-day" style="border-right: 1px solid #ccc;">-</div>';
        }else{
            if (counter>=29)
            calendarHtml += '<div class="calendar-day" style="border-bottom: 1px solid #ccc;">-</div>'; // 实际的日历天数
            else
            calendarHtml += '<div class="calendar-day">-</div>';
        }
    }
    $('#calendar').html(calendarHtml); // 将生成的HTML放入页面的日历容器中
    renderSchedules();
    $('#calendar').on('click', '.calendar-day', function() {
        var date = $(this).data('date'); // 获取点击的日期
        console.log(date);
        dyear = date.split('-')[0]
        dmonth = date.split('-')[1]
        dday = date.split('-')[2]
        if (date) {
            updateEventDetails( dyear, dmonth, dday);
        }else{
            updateEventDetailsby_();
        }
    });
}
function renderSchedules(){
    //ajax，基于当前选择的年月，构造start_date和end_date(范围是1个月)
    if (currentMonth+1<10){
        start_date = currentYear+'-0'+(currentMonth+1)+'-'+'01';
        end_date = currentYear+'-0'+(currentMonth+1)+'-'+'31';}
    else{
        start_date = currentYear+'-'+(currentMonth+1)+'-'+'01';
        end_date = currentYear+'-'+(currentMonth+1)+'-'+'31';}
    
    username = getCookie("username");
    if (!username) window.location.href='/login'
    $.ajax({
        url: '/getPersonalSchedules',
        type: 'POST',
        data: JSON.stringify({
            username: username,
            start_date: start_date,
            end_date: end_date
        }),
        contentType: 'application/json',
        success: function(data) {
            // 处理返回的数据
            if(data.success){
                console.log(data.messageData)
                schedules = data.messageData
                alldayschedules = schedules
                for (let i=0;i<schedules.length;i++){
                    //转化为int
                    sd = parseInt(schedules[i].start_date.split('-')[2])
                    ed = parseInt(schedules[i].end_date.split('-')[2])
                    for (let j=sd;j<=ed;j++){
                        text = $('.calendar-day[data-date="'+currentYear+'-'+(currentMonth+1)+'-'+j+'"]').html()
                        // 数字转化为16进制
                        color = '#'+schedules[i].color.toString(16); 
                        text+='<p style="font-size:13px;color:'+color+';margin:0px;padding:0px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">'+schedules[i].schedule_info+'</p>';
                        $('.calendar-day[data-date="'+currentYear+'-'+(currentMonth+1)+'-'+j+'"]').html(text)
                    }
                }
            }else{
                console.log("数据获取失败");
            }
        },
        fail:function(xhr, status, error) {
        },});
    
}
function updateEventDetailsby_(){
    var detailsHtml = `<p>-</p>`;
    $('#detailsContent').html(detailsHtml);
}
function updateEventDetails(y,m,d) {
    // 假设data是一个包含事件详情的对象
    var detailsHtml = `<p>${y} - ${m} - ${d}</p>`;
    console.log(alldayschedules)
    for (let i=0;i<alldayschedules.length;i++){
        if (parseInt(alldayschedules[i].start_date.split('-')[2])<=d &&
            parseInt(alldayschedules[i].end_date.split('-')[2])>=d
        ){
            color = '#'+schedules[i].color.toString(16); 
            detailsHtml+=`<hr>`
            detailsHtml += `<p style="color:${color};" >规划内容：${alldayschedules[i].schedule_info}</p>`;
            detailsHtml += `<p style="color:${color};" >开始时间：${alldayschedules[i].start_date}</p>`;
            detailsHtml += `<p style="color:${color};" >结束时间：${alldayschedules[i].end_date}</p>`;
            detailsHtml += `<button data-id:${alldayschedules[i].schedule_id} class="btn btn-primary btn-sm" onclick="deleteSchedule(this)">取消</button>`;
        }
    }
    $('#detailsContent').html(detailsHtml);
}
function deleteSchedule(){
    var id = $(this).data('id');
    username = getCookie("username")
    if (!username) window.location.href='/login'
    if (confirm("确定取消该规划吗？")){
        $.ajax({
            url: '/handleScheduleUpdate',
            type: 'POST',
            data: JSON.stringify({
                username: username,
                schedule_id: id,
                update_type: 1,
                update_info: "取消规划"
            }),
            contentType: 'application/json',
            success: function(data) {
                // 处理返回的数据
                if(data.success){
                    console.log(data.messageData)
                }
            },
            fail:function(xhr, status, error) {
            },});
        window.location.reload();
    }
}

function showAddPlanModal() {
    $('#planModal').attr('aria-hidden',false);
}

function fillYearAndMonthSelectors() {
    // 填充年份选择器
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        $('#yearSelector').append(new Option(year, year));
    }
    $('#yearSelector').val(currentYear); // 设置当前年份为选中状态

    // 填充月份选择器
    for (let month = 0; month < 12; month++) {
        $('#monthSelector').append(new Option(month + 1, month));
    }
    $('#monthSelector').val(currentMonth); // 设置当前月份为选中状态
}


function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}