from flask import Flask
from app import app
from user.models import User

@app.route("/user/signup", methods=["POST"])
def signup():
    return User().signup()

@app.route('/user/signout')
def signout():
    return User().signout()

@app.route("/user/login", methods=["POST"])
def login():
    return User().login()

# 위에는 되고 아래는 안됨 왜???
# @app.route('/user/login', methods=["POST"])
# def login():
#     return User.login()