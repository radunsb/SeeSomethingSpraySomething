"""
To install required packages:
python -m pip install --upgrade pip bcrypt argon2-cffi passlib cryptography 
"""

from cryptography.fernet import Fernet
from passlib.hash import argon2
from passlib.hash import bcrypt_sha256

class Hasher:
    def __init__(self):
        with open("pepper.bin", "rb") as pepper_file:
            pepper_key : bytes = pepper_file.read()
            self.pepper: Fernet = Fernet(pepper_key)

    def hash(self, pwd:str) -> bytes:
        #hash the password
        hash_str : str = bcrypt_sha256.using(rounds=12).hash(pwd)
        #convert the hash from a text string to a byte string
        hash_bytes : bytes = hash_str.encode('utf-8')
        #encrypt the byte string
        peppered_hash : bytes = self.pepper.encrypt(hash_bytes)
        return peppered_hash

    def check(self, pwd:str, peppered_hash:bytes) -> bool:
        #decrypt the encrypted hash
        hash_bytes : bytes = self.pepper.decrypt(peppered_hash)
        #convert the decrypted hash back to string form
        hash_str : str = hash_bytes.decode('utf-8')
        #check whether the hash string would match the password if it were hashed
        return bcrypt_sha256.verify(pwd, hash_str)
