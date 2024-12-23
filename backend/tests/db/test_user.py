import pytest
import logging

logging.basicConfig(level="DEBUG")

def test_user(client, db_conn, Users, UserType):

    with client.application.app_context():

        try: 
            new_user = Users(
                email = "algum@email.com",
                password = "algumasenha",
                username = "algumUsername",
            )
            
            db_conn.session.add(new_user)
            db_conn.session.commit()
        except Exception as e:
            logging.info(e)
            assert False

        user = Users.query.filter_by(email="algum@email.com").first()

        assert user.password != "algumasenha"
        assert user.username == "algumUsername"