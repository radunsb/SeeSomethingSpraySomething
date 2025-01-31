from flask import Blueprint, request, session, make_response
from authentication.accounts import create_user_account
import json

auth_v1 = Blueprint(
    'auth_v1', 'auth_v1', url_prefix='/auth/v1')

@auth_v1.route("/create/", methods=["POST"])
def create_account():
    incoming_datamap = request.json

    username = incoming_datamap["username"]
    password = incoming_datamap["password"]
    email = incoming_datamap["email"]

    new_uid = create_user_account(username, password, email)

    if new_uid == None:
        return "User already exists", 409
    else:
        session["uid"] = new_uid
        return "OK", 200
