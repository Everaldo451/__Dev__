class RedisMock:

    def __init__(self, host, port, db, decode_responses):
        self.data = {}

    def get(self, name):
        print("usando RedisMock")
        return self.data.get(name)
    
    def set(self, name, value, ex):
        self.data[name] = value
        return value
    
    def delete(self, *names):
        for name in names:
            self.data.pop(name, None)