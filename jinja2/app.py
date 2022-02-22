from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    name = 'kimbaeseung'
    return render_template('index.html', name=name)

@app.route('/block')
def block():
    return render_template('block.html')

if __name__ == '__main__':
    app.run(debug=True)