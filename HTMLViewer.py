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
BACKEND_SERVER_URL = "http://localhost:5001"

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

def renderMeetingDetails():
    pass

@app.route('/schedule')
def scheduleHtml():
    return render_template('schedule.html')

@app.route('/renderPersonalSchedule', methods=['POST'])
def renderPersonalSchedule():
    pass

@app.route('/handleMeetingFollow', methods=['POST'])
def handleMeetingFollow():
    form_data = request.json
    # data['username']
    # data['meetingId']
    # data['follow']
    return jsonify(json.loads(requests.post(f"{BACKEND_SERVER_URL}/handleMeetingFollow", data=form_data).text))

def handleScheduleUpdate():
    pass

if __name__ == '__main__':
    app.run(debug=True)
