from .. import IRepository
from redis import Redis

class RedisRepository(IRepository):

    def __init__(self, redis_instance:Redis):
        self.redis = redis_instance

    def connect(self):
        pass

    def get(self, id):
        return self.redis.get(id)
    
    def list(self):
        pass
    
    def create(self, **kwargs):
        id = kwargs.pop("id", None)
        value = kwargs.pop("value")
        ex = kwargs.pop("expire", 1000)
        return self.redis.set(id, value, ex=ex)
    
    def update(self, instance, **kwargs):
        value = kwargs.pop("value")
        ex = kwargs.pop("expire", 1000)
        self.redis.set(instance, value, ex=ex)

    def delete(self, obj):
        self.redis.delete(obj)

    def filter(self, many=False, **kwargs):
        pass
