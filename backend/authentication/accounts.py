import os
import sys

import json

parent_dir = os.path.join(os.path.dirname(__file__), "..")
sys.path.append(parent_dir)

from db import get_users, get_db, find_max_id
from authentication.Hasher import Hasher

global_hasher = Hasher()

#return true if the account with that username has the same password
def authenticate_account(un:str, pwd:str) -> int:
    user_list = get_users()

    #this is little better than pseudocode at the moment. I need to see the database schema
    for user in user_list:
        if(user["username"] == un):
            if(global_hasher.check_password(pwd, user["pass_hash"])):
                #TODO: change the status of the app to let the user be logged in.
                return True
    return False

def account_exists(un:str, email:str="") -> int:
    """Returns the user id if the account exists. Returns None otherwise."""
    user_list = get_users()

    for user in user_list:
        if user["username"] == un:
            return user["_id"]
        if user["email"] == email:
            return user["_id"]
    return None
  
def create_user_account(un:str, pwd:str, email:str) -> int:
    """Returns None if the account already exists. Otherwise, returns user_id"""
    if account_exists(un, email):
        return None

    user_id = find_max_id() + 1
    pwd_hash = global_hasher.hash_password(pwd)
    role = "user"
    projects = []

    user_object = {"_id":user_id, "username":un, "email":email, "pass_hash":pwd_hash, "role":role, "projects":[], "recent_runs":[]}

    db = get_db()
    collection = db.get_collection("Users")
    collection.insert_one(user_object)
    
    #When this is called, the session saves the user_id

    return user_id