from flask import Flask, render_template, session, redirect
from functools import wraps
import pymongo

app = Flask(__name__)
app.secret_key = b'\xa4\x84\x8c\x87\x0f\x04\x7f^+U\x03J\x85n\xa5\xc2'

# Database
client = pymongo.MongoClient('localhost', 27017)
db = client.user_login_system

#Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/')

    return wrap

#Routes
from user import routes

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard/')
@login_required
def dashboard():
    return render_template('dashboard.html')



# run 파일로 돌리면 찾아지는 페에지들이 있는데 얘로 돌리면 안찾아진다 왜지?
# if __name__ == '__main__':
#    app.run('0.0.0.0', port=5000, debug=True)