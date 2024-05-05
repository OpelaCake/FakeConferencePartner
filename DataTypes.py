import json
class ReturnCode:
    LOGIN_MESSAGE=0
    REGISTRATION_MESSAGE=1
    MEETING_LIST_MESSAGE=2
    NORMARL_MESSAGE=3
    FOLLOW_MEETING=4
    UNFOLLOW_MEETING=5
    SCHEDULE_LIST=6
    SCHEDULE_UPDATE=7

    def __init__(self, success=False, username="", messageType=NORMARL_MESSAGE, messageData={}) -> None:
        self.success = success
        self.username = username
        self.messageType=messageType
        self.messageData=messageData

    def toJson(self):
        return ReturnCode.__json__(self)

    def __json__(self):
        return {
            "success":self.success,
            "username":self.username,
            "messageType":self.messageType,
            "messageData": self.messageData
        }

'''
ATTRIBUTES:
id*: int: 数据库存储的会议id
name*: string: 会议名称
shortname*: string: 会议简写
due_date*: string: xxxx-xx-xx格式的截稿日期
info_date: string: xxxx-xx-xx格式的通知日期
meeting_date*: string: xxxx-xx-xx格式的举办日期
location: string: 会议地点
CCF_level: string: A/B/C/-，CCF级别
CORE_level: string: A*/A/B/C/-
QUALIS_level: string: A1/A2/B1/B2/B3/B4/B5
'''
class Meeting:
    def __init__(self, id, name, shortname, due_date, info_date, meeting_date, location, CCF_level, CORE_level, QUALIS_level, No) -> None:
        self.id = id
        self.name = name
        self.shortname = shortname
        self.due_date = due_date
        self.info_date = info_date
        self.meeting_date= meeting_date
        self.location = location
        self.CCF_level = CCF_level
        self.CORE_level = CORE_level
        self.QUALIS_level = QUALIS_level
        self.No = No
        self.username=None
        self.followed=False

    def toJson(self):
        return Meeting.__json__(self)

    def __json__(self):
        return {
            "id":self.id,
            "name":self.name,
            "shortname":self.shortname,
            "due_date":self.due_date,
            "info_date":self.info_date,
            "meeting_date":self.meeting_date,
            "location":self.location,
            "CCF_level":self.CCF_level,
            "CORE_level":self.CORE_level,
            "QUALIS_level":self.QUALIS_level,
            "username":self.username,
            "followed":self.followed
        }
    

'''
ATTRIBUTES:
schedule_id*: int: ScheduleID
username*: string: 账户名
start_date*: string: xxxx-xx-xx格式的开始日期
end_date*: string: xxxx-xx-xx格式的结束日期
schedule_info*: string: 规划内容
color: string: 0fxxxxxx格式的颜色（用于日历上显示）
'''
import random
class Schedule:
    def __init__(self, schedule_id, username, start_date, end_date, schedule_info, color=None) -> None:
        self.schedule_id = schedule_id
        self.username = username
        self.start_date = start_date
        self.end_date = end_date
        self.schedule_info = schedule_info
        self.color = color
        if self.color == None:
            self.color = random.randint(0, 0xffffff)

    def __json__(self):
        return {
            "schedule_id":self.schedule_id,
            "username":self.username,
            "start_date":self.start_date,
            "end_date":self.end_date,
            "schedule_info":self.schedule_info,
            "color":self.color
        }
        
'''
ATTRIBUTES:
updateType*: string: 增删（"add"/"delete")
schedule_id(* when delete): int: ScheduleID
username(* when add): string: 账号名
start_date(* when add): string: xxxx-xx-xx格式的开始日期
end_date(* when add): string: xxxx-xx-xx格式的结束日期
schedule_info(* when add): string: 规划内容
color: string: 0fxxxxxx格式的颜色（用于日历上显示）
'''
class ScheduleUpdate:
    def __init__(self, updateType, schedule_id=None, username=None, start_date=None, end_date=None, schedule_info=None, color=None) -> None:
        self.updateType = updateType
        self.schedule_id = schedule_id
        self.username = username
        self.start_date = start_date
        self.end_date = end_date
        self.schedule_info = schedule_info
        self.color = color
    
    def __json__(self):
        return {
            "updateType":self.updateType,
            "schedule_id":self.schedule_id,
            "username":self.username,
            "start_date":self.start_date,
            "end_date":self.end_date,
            "schedule_info":self.schedule_info,
            "color":self.color
        }