#JWT#

class JWTExceptions():

    class TokenTypeError(Exception):
        "Tipo de Token incorreto"
        pass

    class TokenLifetimeExceded(Exception):
        "Tempo do token excedido"
        pass


    pass