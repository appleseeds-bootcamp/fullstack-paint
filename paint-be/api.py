import bottle as b
from bottle import get, post, put, delete, static_file, hook, template
import json
import utils.db as db
from utils.login import get_user_session_id, hash_password, isUserLoggedIn, loginUserOrSignUp

FE_BUILD_DIR = "../paint-fe/build"

# Static files:
@get('/static/<dirname:re:.*>/<filename:re:.*>')
def serve_static_dir(dirname, filename):
    return static_file(filename, root=f'{FE_BUILD_DIR}/static/{dirname}')


@get("/<filename:re:.*>")
def serve_root_dir(filename):
    if filename == "index.html": # We want to avoid getting /index.html directly.
        b.redirect("/")
    return static_file(filename, root=FE_BUILD_DIR)


@get('/')
def index():
    username = b.request.get_cookie("username")
    session_id = b.request.get_cookie("session_id")
    if not db.is_user_logged_in(username, session_id):
        res = b.redirect("/login?next_url=/")
        res.set_cookie('session_id', '', expires=0)
        res.set_cookie('username', '', expires=0)
        return res

    return static_file("/index.html", root="../paint-fe/build")


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


@get("/login")
def render_login_page():
    username = b.request.get_cookie("username")
    if not isUserLoggedIn(b.request, username):
        requested_url = b.request.get("next_url", "/")
        context = {"next_url": requested_url, "err_msg": ""}
        return template("templates/login.html", **context)
    else:
        return b.redirect("/")


@post('/login')
def login_or_signup():
    username = b.request.forms.get("username")
    password = b.request.forms.get("password")

    if not isUserLoggedIn(b.request, username):
        new_session_id = loginUserOrSignUp(username, password)
        if new_session_id:
            b.response.set_cookie("session_id", new_session_id)
            b.response.set_cookie("username", username)
        else:
            return template("templates/login.html", next_url="/", err_msg="Bad username/password, try again")

    return b.redirect("/")
