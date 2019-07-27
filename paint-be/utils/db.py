import pymysql

connection = pymysql.connect(
    host="localhost",
    user="root",
    password="root",
    db="paint",
    charset="utf8",
    cursorclass=pymysql.cursors.DictCursor
)


def insert_new_painting(username, name, painting):
    with connection.cursor() as cursor:
        query = "INSERT INTO paintings (username, name, painting) values ('{}', '{}', '{}' )".format(
            username,
            name,
            painting
        )
        cursor.execute(query)
        connection.commit()


def delete_painting(username, name):
    with connection.cursor() as cursor:
        query = "DELETE FROM paintings WHERE username='{}' and name='{}' ".format(
            username, name)
        cursor.execute(query)
        connection.commit()

def get_paintings(username):
    with connection.cursor() as cursor:
        query = "SELECT name from paintings where username='{}'".format(
            username)
        cursor.execute(query)
        paintings = cursor.fetchall()
        return paintings

def get_painting(username, name):
    with connection.cursor() as cursor:
        query = "SELECT painting from paintings where username='{}' and name='{}'".format(
            username, name)
        cursor.execute(query)
        painting = cursor.fetchone()
        return painting
    
def is_user_logged_in(username, session_id):
    if not session_id:
        return False
    try:
        with connection.cursor() as cursor:
            query = "SELECT * FROM users WHERE username = '{}' AND sessionId = '{}'".format(
                username, session_id)
            cursor.execute(query)
            result = cursor.fetchone()
            return result is not None
    except Exception as e:
        print(e)
        return False


def is_user_exist(username):
    try:
        with connection.cursor() as cursor:
            query = "SELECT * FROM users WHERE username = '{}'".format(
                username)
            cursor.execute(query)
            result = cursor.fetchone()
            return result is not None
    except Exception as ex:
        print(ex)
        return False

def verify_user_password(username, password):
    try:
        with connection.cursor() as cursor:
            query = "SELECT * FROM users WHERE username = '{}' AND password ='{}'".format(
                username, password)
            cursor.execute(query)
            result = cursor.fetchone()
            return result is not None
    except Exception as ex:
        print(ex)
        return False


def add_new_user(username, password, session_id):
    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO users (username, password, sessionId) values ('{}', '{}', '{}' )".format(
                username,
                password,
                session_id
            )
            cursor.execute(query)
            connection.commit()
    except Exception as e:
        print(e)
        return False


def update_user_session(username, password, session_id):
    try:
        with connection.cursor() as cursor:
            query = "UPDATE users SET sessionId = '{}' WHERE username = '{}' AND password = '{}'".format(
                session_id, username, password)
            cursor.execute(query)
            connection.commit()
    except Exception as e:
        print(e)
        return False
