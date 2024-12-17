import pytest

def test_user(db, User_Model):
    new_user = User_Model(
        email = "algum@email.com",
        senha = "algumasenha",
        username = "algumUsername"
    )

    try: 
        db.add(User_Model)
        db.commit()
    except Exception as e:
        assert False

    user = User_Model.query(db).filter_by(email="algum@email.com")

    assert user.password == "algumasenha"
    assert user.username == "algumUsername"