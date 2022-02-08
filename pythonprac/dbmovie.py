from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.gjg5o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.dbsparta

db.movies.update_one({'title':'가버나움'},{'$set':{'rate':'0'}})