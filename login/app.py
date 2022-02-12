from flask import Flask, render_template
import pymongo

# Database
client = pymongo.MongoClient('localhost', 27017)
db = client.user_login_system

app = Flask(__name__)

#Routes
from user import routes

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard/')
def dashboard():
    return render_template('dashboard.html')



# run 파일로 돌리면 찾아지는 페에지들이 있는데 얘로 돌리면 안찾아진다 왜지?
# if __name__ == '__main__':
#    app.run('0.0.0.0', port=5000, debug=True)