import os
import sys

parent_dir = os.path.join(os.path.dirname(__file__), "..")
sys.path.append(parent_dir)

from db import get_users
from hasher import Hasher

global_hasher = Hasher()

def authenticate_account(un:str, pwd:str) -> bool:
    user_list = get_users()
    
    #this is little better than pseudocode at the moment. I need to see the database schema
    for user in user_list:
        if(user.username == un):
            if(global_hasher.check(pwd, user.pwd_hash)):
                #TODO: change the status of the app to let the user be logged in.
                return True
    return False
    
        
# def create_account(all the things you need in order to make an account)
#     hash the password
#     make a db record with all necessary fields
#     #TODO: change the status of the app so that the user is logged in