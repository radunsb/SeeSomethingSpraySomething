from factory import create_app
from db import get_nozzles, get_controllers, get_guns

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

