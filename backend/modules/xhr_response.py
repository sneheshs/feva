class xhr_response:
    def __init__(self, source, status = -1000, data={}):
        self.source = source
        self.status = status
        self.data = data

    def getResponse(self):
        return { 
            'source': self.source,
            'status': self.status,
            'data': self.data
        }
