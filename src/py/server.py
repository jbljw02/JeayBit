from flask import Flask, jsonify
from price_per_stack import price

app = Flask(__name__)

@app.route('/data')
def get_data():
    data = price()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
