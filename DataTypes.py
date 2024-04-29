class ReturnCode:
    LOGIN_MESSAGE=0
    REGISTRATION_MESSAGE=1
    MEETING_LIST_MESSAGE=2
    NORMARL_MESSAGE=3

    def __init__(self, success=False, username="", messageType=NORMARL_MESSAGE, messageData={}) -> None:
        self.success = success
        self.username = username
        self.messageType=messageType
        self.messageData=messageData

    def toJson(self):
        return {
            "success":self.success,
            "username":self.username,
            "messageType":self.messageType,
            "messageData":self.messageData
        }