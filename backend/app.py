from factory import create_app, jsonify
from db import get_nozzles, get_controllers, get_guns

def fetch_nozzles():
    try:
        nozzles = get_nozzles()
        return(jsonify(nozzles))
    except Exception as e:
        return e
    
def fetch_controllers():
    try:
        controllers = get_controllers()
        return(jsonify(controllers))
    except Exception as e:
        return e
    
def fetch_guns():
    try:
        guns = get_guns()
        return(jsonify(guns))
    except Exception as e:
        return e

#delete after debugging auth
from authentication import accounts

if __name__ == "__main__":
    app = create_app()

#delete all this after debugging auth:
    # with app.app_context():
    #     #print("\n\n\n" + str(accounts.global_hasher.hash_password("jerryspassword")) + "\n\n\n")
    #     print("\n\n\n" + str(accounts.create_user_account("robert_spray", "notjerryspassword", "sprayR@spray.com")) + "\n\n\n")

#keep everything after this
    app.config['DEBUG'] = True
    app.run()

