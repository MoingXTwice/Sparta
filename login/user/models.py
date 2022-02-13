from flask import Flask, jsonify, request, session, redirect
from passlib.hash import pbkdf2_sha256
from app import db
import uuid

class User:

    def start_session(self, user):
        del user['password']
        session['logged_in'] = True
        session['user'] = user
        return jsonify(user), 200

    def signup(self):

        user = {
            "_id": uuid.uuid4().hex,
            "name": request.form.get('name'),
            "email": request.form.get('email'),
            "password": request.form.get('password')
        }

        #패스워드 암호화
        user['password'] = pbkdf2_sha256.encrypt(user['password'])

        # 이메일 중복 체크
        if db.users.find_one({"email" : user['email']}):
            return jsonify({"error": "중복된 이메일 입니다."}), 400

        if db.users.insert_one(user):
            return self.start_session(user)

        return jsonify({"error":"회원가입 실패"}), 400

    def signout(self):
        session.clear()
        return redirect('/')

    def login(self):

        user = db.users.find_one({
            "email": request.form.get("email")
        })

        if user:
            return self.start_session(user)

        return jsonify({"error": "로그인 정보가 일치하지 않습니다."}), 401