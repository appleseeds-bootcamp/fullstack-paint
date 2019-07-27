from uuid import uuid4
import hashlib
import utils.db as db

def get_user_session_id():
    return uuid4().hex[:8]


def hash_password(password):
    salt = "13Ebu54"
    return hashlib.md5((salt + password).encode('utf-8')).hexdigest()

def isUserLoggedIn(request, username):
    session_id = request.get_cookie("session_id")
    if db.is_user_logged_in(username, session_id):
        return True


def loginUserOrSignUp(username, password):
    new_session_id = get_user_session_id()
    hashed_password = hash_password(password)
    if not db.is_user_exist(username):
        db.add_new_user(username, hashed_password, new_session_id)
    elif db.verify_user_password(username, hashed_password):
        db.update_user_session(username, hashed_password, new_session_id)
    else:
        return False

    return new_session_id
