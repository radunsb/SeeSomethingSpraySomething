
from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import PyMongo

def get_db():
    """
    Configuration method to return db instance
    """
    db = getattr(g, "_database", None)

    if db is None:

        db = g._database = PyMongo(current_app).db
       
    return db


# Use LocalProxy to read the global db instance with just `db`
db = LocalProxy(get_db)

def get_controllers():
    try:
        return list(db.Controllers.find({}))
    except Exception as e:
        return e
    
def get_users():
    try:
        return list(db.Users.find({}))
    except Exception as e:
        return e

def get_nozzles():
    try:
        return list(db.Nozzles.find({}))
    except Exception as e:
        return e

def get_guns():
    try:
        return list(db.Guns.find({}))
    except Exception as e:
        return e

def get_projects_by_user(user_id):
    try:
        user = db.Users.find_one({'_id': user_id})
        return list(user['owned_projects']) + list(user['collaborating_projects'])
    except Exception as e:
        return e