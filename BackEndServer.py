from flask import Flask,request,jsonify
from DataTypes import *
app = Flask(__name__)


@app.route("/handleRegistrationForm", methods=['POST'])
def handleRegistrationForm():
    form_data = request.form
    # toDo
    # 向数据库写入用户数据
    print(form_data.get("username"))
    if form_data:
        username = form_data["username"]
        password = form_data["password"]
        # process in database
        return jsonify(ReturnCode(success=True, username=username, messageType=ReturnCode.REGISTRATION_MESSAGE).toJson())
    return jsonify(ReturnCode(success=False).toJson())

@app.route('/handleLoginForm', methods=['POST'])
def handleLoginForm():
    form_data = request.form
    # toDo
    # 从数据库读取匹配用户数据
    if form_data:
        if form_data["username"]=='ckc' and form_data["password"]=='123456':
            return jsonify(ReturnCode(success=True, messageType=ReturnCode.LOGIN_MESSAGE).toJson())
    return jsonify(ReturnCode().toJson())

@app.route('/renderMeetingsList', methods=['POST'])
def getMeetingsList():
    data = request.form
    if data:
        page = data['page']
        numper = data['numper']
        username = None
        if 'username' in data:
            username = data['username']
            # 如果会议被用户关注了，那么就添加一个关注字段
        r = ReturnCode(success=True, messageType=ReturnCode.MEETING_LIST_MESSAGE)
        r.messageData = [Meeting(1, "2019年11月会议", "简写2019-11", "2019-11-01", "2019-11-01", "2019-11-01", "北京", "CCF", "CORE", "QUALIS",1)]
        r.messageData.append(Meeting(2, "2019年12月会议", "简写2019-12", "2019-12-01", "2019-12-01", "2019-12-01", "北京", "CCF", "CORE", "QUALIS",2))
        if username is not None:
            # toDo
            # 从数据库中获取username的所有关注meeting
            followedIDList = [2]
            for i in range(len(r.messageData)):
                r.messageData[i].username = username
                if r.messageData[i].id in followedIDList:
                    r.messageData[i].followed = True
        r.messageData = [meeting.__json__() for meeting in r.messageData]
        return jsonify(r.toJson())

    return jsonify(ReturnCode().toJson())

@app.route('/renderMeetingDetails', methods=['POST'])
def getMeetingDetails():
    data = request.form
    if data:
        if 'meeting_id' in data:
            meeting_id = data['meeting_id']
            # toDo
            #从数据库中获取meeting，它的id是meeting_id
            m = Meeting(1, "2019年11月会议", "简写2019-11", "2019-11-01", "2019-11-01", "2019-11-01", "北京", "CCF", "CORE", "QUALIS",1, 
                        details_info='<p>会议内容</p>')
        else:
            shortname = data['meeting_shortname']
            edition = data['edition']
            # toDo
            # 从数据库中获取meeting，它的简写是shortname，届数是edition
            m = Meeting(1, "2019年11月会议", "简写2019-11", "2019-11-01", "2019-11-01", "2019-11-01", "北京", "CCF", "CORE", "QUALIS",1,
                        details_info='<p>会议内容</p>')
        if 'username' in data:
            # 如果登录，则需要展示该用户是否已经关注此会议
            m.username = data['username']
            # toDo
            # 从数据库中获取username的所有关注meeting
            follow_meeting_id_list = [1]
            if m.id in follow_meeting_id_list:
                m.followed = True
        return jsonify(ReturnCode(success=True, messageType=ReturnCode.MEETING_DETAILS_MESSAGE, messageData=m.__json__()).toJson())
            
    return jsonify(ReturnCode().toJson())

@app.route('/getPersonalSchedules', methods=['POST'])
def getPersonalSchedules():
    data = request.form
    if data:
        username = data['username']
        start_date = data['start_date']
        end_date = data['end_date']
        # toDo
        # 从数据库中获取username的所有Schedule，范围从start_date-end_date
        schedule_list = []
        schedule_list.append(
            Schedule(
                schedule_id=1,
                username='ckc', 
                start_date='2024-5-01', 
                end_date='2024-5-03', 
                schedule_info='参加a会议', 
                color=0xff00ff
            )
        )
        schedule_list.append(
            Schedule(
                schedule_id=1,
                username='ckc', 
                start_date='2024-5-01', 
                end_date='2024-5-02', 
                schedule_info='参加b会议', 
                color=0xff0000
            )
        )
        schedule_list.append(
            Schedule(
                schedule_id=1,
                username='ckc', 
                start_date='2024-5-01', 
                end_date='2024-5-01', 
                schedule_info='参加c会议', 
                color=0xff00ff
            )
        )

        schedule_list = [schedule.__json__() for schedule in schedule_list]
        return jsonify(ReturnCode(success=True, messageType=ReturnCode.SCHEDULE_LIST, messageData=schedule_list).toJson())
    return jsonify(ReturnCode().toJson())

@app.route('/handleMeetingFollow', methods=['POST'])
def followMeeting():
    data = request.form
    if data:
        meetingid = data['meetingId']
        username = data['username']
        follow = data['follow']
        if follow == 'true':
            # toDo
            # 在数据库中添加关注
            # 在数据库中添加三个schedule，分别是截稿日期、通知日期、会议日期
            # 这三个schedule的start_data分别是今天、截稿日期、会议日期
            # 这三个schedule的end_data分别是截稿日期、通知日期、会议日期
            # 这三个schedule的schedule_info为"*[会议简写][截稿阶段]""*[会议简写][通知阶段]""*[会议简写][会议日]"
            # 我会在前台控制自定义schedule的schedule_info不可以包含*号，因此利用这个*号可以识别出哪些是自动生成的schedule
            return jsonify(ReturnCode(success=True, messageType=ReturnCode.FOLLOW_MEETING,username=username,messageData=meetingid).toJson())
        else:
            # toDo
            # 在数据库中取消关注
            # 将该用户的schedule中，schedule_info以"*[会议简写]"开头的schedule删除（应该是3个）
            return jsonify(ReturnCode(success=True, messageType=ReturnCode.UNFOLLOW_MEETING,username=username,messageData=meetingid).toJson())
    return  jsonify(ReturnCode().toJson())


@app.route('/handleScheduleUpdate', methods=['POST'])
def handleScheduleUpdate():
    data = request.form
    if data:
        if data['username']:
            if data['update_type']=='1':
                schedule_id = data['schedule_id']
                # toDo
                # 在数据库中删除schedule
                return jsonify(ReturnCode(success=True, messageType=ReturnCode.SCHEDULE_UPDATE,username=data['username'],messageData=schedule_id).toJson())
            elif data['update_type']=='0':
                # toDo
                # data['username']
                # data['start_date']
                # data['end_date']
                # data['schedule_info']
                # 可选 data['color']
                # 依据上述属性在数据库中添加schedule，得到schedule_id
                schedule_id = 1
                s = Schedule(schedule_id, data['username'],data['start_date'],data['end_date'],data['schedule_info'],data['color'])
                return jsonify(ReturnCode(success=True, messageType=ReturnCode.SCHEDULE_UPDATE,username=data['username'],messageData=s.__json__()).toJson())

    return  jsonify(ReturnCode().toJson())

if __name__ == '__main__':
    app.run(debug=True, port=5018)