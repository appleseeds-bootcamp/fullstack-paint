import bottle as b
from bottle import get, post, put, delete, static_file
import json
import utils.db as db
from utils.hashing import get_user_session_id, hash_password

FE_BUILD_DIR = "../paint-fe/build"

# Static files:
@get('/static/<dirname:re:.*>/<filename:re:.*>')
def serve_static_dir(dirname, filename):
    return static_file(filename, root=f'{FE_BUILD_DIR}/static/{dirname}')

@get("/<filename:re:.*>")
def serve_root_dir(filename):
    return static_file(filename, root=FE_BUILD_DIR)

@get('/')
def index():
    username = b.request.get_cookie("username")
    session_id = b.request.get_cookie("session_id")
    res = b.static_file("/index.html", root="../paint-fe/build")
    if not db.is_user_logged_in(username, session_id):
        res.set_cookie('session_id', '', expires=0)
        res.set_cookie('username', '', expires=0)
    return res


@post('/save')
def save_painting():
    username = b.request.get_cookie("username")
    name = b.request.json.get("name")
    painting = json.dumps(b.request.json.get("painting"))
    try:
        db.insert_new_painting(username, name, painting)
        return {"saved": True}
    except Exception as e:
        print(e)
        b.response.status = 500
        b.response["status__line"] = "error saving painting in the DB"
        return b.response


@delete('/delete')
def delete_painting():
    username = b.request.get_cookie("username")
    name = b.request.query.get("name")
    try:
        db.delete_painting(username, name)
    except Exception as e:
        print(e)
        b.response.status = 500
        b.response["status__line"] = "error writing to DB on save"
    return b.response


@get('/paintings')
def get_paintings():
    username = b.request.get_cookie("username")
    try:
        paintings = db.get_paintings(username)
        return json.dumps({"paintings": paintings})
    except Exception as e:
        print(e)
        return json.dumps("error writing to DB")


@get('/painting')
def get_painting():
    username = b.request.get_cookie("username")
    name = b.request.query.name
    try:
        painting = db.get_painting(username, name)
        return json.dumps(painting)
    except Exception as e:
        print(e)
        return json.dumps("error writing to DB")


@post('/login')
def signup():
    username = b.request.forms.get("username")
    password = b.request.forms.get("password")
    hashed_password = hash_password(password)
    session_id = b.request.get_cookie("session_id")
    new_session_id = get_user_session_id()
    if db.is_user_logged_in(username, session_id):
        return b.static_file('index.html')
    if not db.is_user_exist(username, hashed_password):
        db.add_new_user(username, hashed_password, new_session_id)
    db.update_user_session(username, hashed_password, new_session_id)
    b.response.set_cookie("session_id", new_session_id)
    b.response.set_cookie("username", username)
    b.redirect('/')
