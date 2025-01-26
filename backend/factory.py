import os

from flask import Flask
from flask_cors import CORS
import configparser
config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

from routes import api_v1

def create_app():
    app = Flask(__name__)
    CORS(app, origins=['http://localhost:5000','http://localhost:5173'], methods=['GET', 'POST'])
    app.register_blueprint(api_v1)
    app.config['MONGO_URI'] = config['PROD']['CLIENT_URI']
    return app