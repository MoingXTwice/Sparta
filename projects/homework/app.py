from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.gjg5o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
   return render_template('index.html')

@app.route("/homework", methods=["POST"])
def homework_post():
    nickname_receive = request.form['nickname_give']
    comment_receive = request.form['comment_give']

    doc = {
        'nickname':nickname_receive, 'comment':comment_receive
    }

    db.king.insert_one(doc)

    return jsonify({'msg':'웅원 완료'})

@app.route("/homework", methods=["GET"])
def homework_get():
    lists = list(db.king.find({},{'_id':False}))
    return jsonify({'lists':lists})

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)