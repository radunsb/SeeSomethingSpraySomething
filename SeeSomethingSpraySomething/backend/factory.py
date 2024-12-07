import os

from flask import Flask, render_template
from flask_cors import CORS
##from flask_bcrypt import Bcrypt
##from flask_jwt_extended import JWTManager

from bson import json_util, ObjectId
from datetime import datetime, timedelta

from routes import api_v1


def create_app():

    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(api_v1)

    return app