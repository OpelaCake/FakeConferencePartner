'''
这个文件是前端服务器。
静态文件全部存放在HTMLViewer文件夹中
'''
from flask import Flask, render_template, request, jsonify, make_response
import requests
from DataTypes import *
import json

app = Flask(__name__, static_folder='./HTMLViewer/statics', template_folder='./HTMLViewer/statics/htmls')

# 定义后端服务器的地址
BACKEND_SERVER_URL = "http://localhost:5018"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def loginHtml():
    return render_template('login.html')
@app.route('/handleLoginForm', methods=['POST'])
def handleLoginForm():
    form_data = request.json
    response = requests.post(f"{BACKEND_SERVER_URL}/handleLoginForm", data=form_data)
    resp = make_response(response.json())
    if form_data.get('rememberMe') is not None and form_data.get('rememberMe') == True:
        resp.set_cookie('username', form_data.get('username'), max_age=7*60*60*24)
    else:
        resp.set_cookie('username', form_data.get('username'), max_age=60*60)

    return resp

@app.route('/handleRegistrationForm', methods=['POST'])
def handleRegistrationForm():
    form_data = request.json
    response = requests.post(f"{BACKEND_SERVER_URL}/handleRegistrationForm", data=form_data)
    return jsonify(response.json())


@app.route('/renderMeetingsList', methods=['POST'])
def renderMeetingsList():
    form_data = request.json
    # data['page']
    # data['numper']
    meetings = json.loads(requests.post(f"{BACKEND_SERVER_URL}/renderMeetingsList", data=form_data).text)
    return jsonify(meetings)


# 路由可以接收会议ID
@app.route('/renderMeetingDetails/<int:meeting_id>',methods=['GET'])
def renderMeetingDetailsById(meeting_id):
    form_data = {'meeting_id': meeting_id}
    meeting = json.loads(requests.post(f"{BACKEND_SERVER_URL}/renderMeetingDetails", data=form_data).text)
    if meeting['success'] == False:
        return render_template('meeting_details_not_found.html')
    return render_template('meeting_details.html', meeting=meeting["messageData"])

# 路由可以接收会议简写和届数
@app.route('/renderMeetingDetails/<meeting_shortname>/<int:edition>',methods=['GET'])
def renderMeetingDetailsByShortnameAndEdition(meeting_shortname, edition):
    form_data = {'meeting_shortname': meeting_shortname,'edition':edition}
    # 假设有一个函数get_meeting_by_shortname_and_edition来获取会议数据
    meeting = json.loads(requests.post(f"{BACKEND_SERVER_URL}/renderMeetingDetails", data=form_data).text)
    if meeting['success']  == False:
        return render_template('meeting_details_not_found.html')
    return render_template('meeting_details.html', meeting=meeting['messageData'])





@app.route('/schedule')
def scheduleHtml():
    return render_template('schedule.html')

@app.route('/getPersonalSchedules', methods=['POST'])
def getPersonalSchedules():
    form_data = request.json
    schedules = json.loads(requests.post(f"{BACKEND_SERVER_URL}/getPersonalSchedules", data=form_data).text)
    return jsonify(schedules)


@app.route('/handleMeetingFollow', methods=['POST'])
def handleMeetingFollow():
    form_data = request.json
    # data['username']
    # data['meetingId']
    # data['follow']
    return jsonify(json.loads(requests.post(f"{BACKEND_SERVER_URL}/handleMeetingFollow", data=form_data).text))

@app.route('/handleScheduleUpdate', methods=['POST'])
def handleScheduleUpdate():
    form_data = request.json
    # data['schedule_id']
    # data['update_type'] 0 is add, 1 is delete
    return jsonify(json.loads(requests.post(f"{BACKEND_SERVER_URL}/handleScheduleUpdate", data=form_data).text))

if __name__ == '__main__':
    app.run(debug=True)
