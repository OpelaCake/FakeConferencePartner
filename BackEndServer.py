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
        r.messageData = [Meeting(1, "2019年11月会议", "2019-11", "2019-11-01", "2019-11-01", "2019-11-01", "北京", "CCF", "CORE", "QUALIS")]
        r.messageData.append(Meeting(2, "2019年12月会议", "2019-12", "2019-12-01", "2019-12-01", "2019-12-01", "北京", "CCF", "CORE", "QUALIS"))
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

def getMeetingDetails():
    pass

def getPersonalSchedules():
    pass

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
            return jsonify(ReturnCode(success=True, messageType=ReturnCode.FOLLOW_MEETING,username=username,messageData=meetingid).toJson())
        else:
            # toDo
            # 在数据库中取消关注
            return jsonify(ReturnCode(success=True, messageType=ReturnCode.UNFOLLOW_MEETING,username=username,messageData=meetingid).toJson())
    return  jsonify(ReturnCode().toJson())

def updateSchedule():
    pass

if __name__ == '__main__':
    app.run(debug=True, port=5001)