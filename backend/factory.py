import os

from flask import Flask, jsonify
from flask_cors import CORS
import configparser
config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

from routes import api_v1
from authentication.auth_routes import auth_v1

def create_app():
    app = Flask(__name__)
    CORS(app, origins=['http://localhost:5000','http://localhost:5173'], methods=['GET', 'POST'])
    app.register_blueprint(api_v1)
    app.register_blueprint(auth_v1)
    app.config['MONGO_URI'] = config['PROD']['CLIENT_URI']

    session_key_file = open("./authentication/session_key.txt", "r")
    app.config['SECRET_KEY'] = session_key_file.read()
    session_key_file.close()

    return app