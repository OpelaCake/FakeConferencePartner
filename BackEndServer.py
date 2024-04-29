from flask import Flask,request,jsonify
from DataTypes import *
app = Flask(__name__)


@app.route("/handleRegistrationForm", methods=['POST'])
def handleRegistrationForm():
    form_data = request.form
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
    # 从数据库读取匹配用户数据
    if form_data:
        if form_data["username"]=='ckc' and form_data["password"]=='123456':
            return jsonify(ReturnCode(success=True, messageType=ReturnCode.LOGIN_MESSAGE).toJson())
    return jsonify(ReturnCode().toJson())

def getMeetingsList():
    pass

def getMeetingDetails():
    pass

def getPersonalSchedules():
    pass

def followMeeting():
    pass

def updateSchedule():
    pass

if __name__ == '__main__':
    app.run(debug=True, port=5001)