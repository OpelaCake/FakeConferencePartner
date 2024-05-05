var currentYear = new Date().getFullYear(); // 当前年份
var currentMonth = new Date().getMonth(); // 当前月份，从0开始计数

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
});



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
function updateEventDetailsby_(){
    var detailsHtml = `<p>-</p>`;
    $('#detailsContent').html(detailsHtml);
}
function updateEventDetails(y,m,d) {
    // 假设data是一个包含事件详情的对象
    var detailsHtml = `<p>year: ${y}</p><p>month: ${m}</p><p>day: ${d}</p>`;
    $('#detailsContent').html(detailsHtml);
}

function addEvent() {
    // 这里可以添加添加事件的逻辑
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