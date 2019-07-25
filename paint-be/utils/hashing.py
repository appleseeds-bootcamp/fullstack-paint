from uuid import uuid4
import hashlib

def get_user_session_id():
    return uuid4().hex[:8]


def hash_password(password):
    salt = "13Ebu54"
    return hashlib.md5((salt + password).encode('utf-8')).hexdigest()