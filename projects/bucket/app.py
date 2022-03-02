from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.gjg5o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.dbsparta


@app.route('/')
def home():
   return render_template('index.html')

@app.route("/bucket", methods=["POST"])
def bucket_post():
    bucket_receive = request.form['bucket_give']

    bucket_list = list(db.bucket.find({}, {'_id': False}))
    count = len(bucket_list) + 1

    doc = {
        'id':count,
        'bucket':bucket_receive,
        'done':0
    }

    db.bucket.insert_one(doc)

    return jsonify({'msg': 'complete'})

@app.route("/bucket/done", methods=["POST"])
def bucket_done():
    id_receive = request.form['id_give']
    db.bucket.update_one({'id':int(id_receive)},{'$set':{'done':1}})
    return jsonify({'msg': 'POST(완료) 연결 완료!'})

@app.route("/bucket", methods=["GET"])
def bucket_get():
    bucket_list = list(db.bucket.find({},{'_id':False}))
    return jsonify({'bucket': bucket_list})


@app.route("/bucket/done_cancel", methods=["POST"])
def bucket_done_cancel():
    id_receive = request.form['id_give']
    db.bucket.update_one({'id':int(id_receive)},{'$set':{'done':0}})
    return jsonify({'msg': 'POST(완료) 연결 완료!'})


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)