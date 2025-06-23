def environment_initializer(environment:str):
    from .. import config
    environments = {
        "production": config.ProductionConfig(),
        "test": config.TestingConfig()
    }

    return environments.get(environment, config.DevelopmentConfig())

