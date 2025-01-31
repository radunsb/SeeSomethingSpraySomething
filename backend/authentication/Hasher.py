"""
To install required packages:
python -m pip install --upgrade pip bcrypt argon2-cffi passlib cryptography 
"""

from cryptography.fernet import Fernet
from passlib.hash import argon2
from passlib.hash import bcrypt_sha256

import os

class Hasher:
    def __init__(self):
        pepper_location = os.path.dirname(__file__) + "/pepper.bin"
        with open(pepper_location, "rb") as pepper_file:
            pepper_key : bytes = pepper_file.read()
            self.pepper: Fernet = Fernet(pepper_key)

    def hash_password(self, pwd:str) -> bytes:
        #hash the password
        hash_str : str = bcrypt_sha256.using(rounds=12).hash(pwd)
        #convert the hash from a text string to a byte string
        hash_bytes : bytes = hash_str.encode('utf-8')
        #encrypt the byte string
        peppered_hash : bytes = self.pepper.encrypt(hash_bytes)
        return peppered_hash

    def check_password(self, pwd:str, peppered_hash:bytes) -> bool:
        #decrypt the encrypted hash
        hash_bytes : bytes = self.pepper.decrypt(peppered_hash)
        #convert the decrypted hash back to string form
        hash_str : str = hash_bytes.decode('utf-8')
        #check whether the hash string would match the password if it were hashed
        return bcrypt_sha256.verify(pwd, hash_str)
    
def random_pepper():
    return Fernet.generate_key()


#DO NOT uncomment and run these functions except during initial setup
#If you run new_session_key, it will log all users out
#If you run new_password_pepper, you will lose your ability to decrypt passwords from the database

# def new_session_key():
#     new_key = random_pepper()
#     new_key_str = new_key.decode('utf-8')
#     #print(new_key_str)

#     filepath = os.path.dirname(__file__) + "/session_key.txt"

#     f = open(filepath, "w") #change "w" to "x" if you're creating a session_key file for the first time
#     f.write(new_key_str)
#     f.close()

# def new_password_pepper():
#     new_pepper = random_pepper()
#     #print(new_pepper)

#     filepath = os.path.dirname(__file__) + "/pepper.bin"

#     f = open(filepath, "wb") #change "w" to "x" if you're creating a pepper for the first time
#     f.write(new_pepper)
#     f.close()

# if(__name__ == "__main__"):
#     print("hello")
#     new_password_pepper()
#     #new_session_key()