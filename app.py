from flask import Flask, render_template, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'BookWorld API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
