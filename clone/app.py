from flask import Flask, render_template, request, jsonify, redirect, url_for
import jwt
import datetime
import hashlib
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["UPLOAD_FOLDER"] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.clone

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html', msg='회원가입 페이지')

# 서버 ID 중복체크 API
@app.route('/register/check_dup', methods=['POST'])
def check_dup():
    id_receive = request.form['id']
    exists = bool(db.member.find_one({'id':id_receive}))
    return jsonify({'result':'success', 'exists':exists})

# 서버 닉네임 중복체크 API
@app.route('/register/check_dup_nick', methods=['POST'])
def check_dup_nick():
    nick_receive = request.form['nick']
    exists = bool(db.member.find_one({'nick':nick_receive}))
    return jsonify({'result':'success', 'exists':exists})

# 서버 아이디 생성 API
@app.route('/register/save', methods=['POST'])
def sign_up():
    id_receive = request.form['id']
    nick_receive = request.form['nick']
    password_receive = request.form['password']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        'user_id': id_receive,
        'nick': nick_receive,
        'password': password_hash
    }
    db.member.insert_one(doc)
    return jsonify({'result':'success'})


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)