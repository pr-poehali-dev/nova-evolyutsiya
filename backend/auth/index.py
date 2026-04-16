"""
Регистрация и вход пользователей фитнес-клуба «В тонусе».
POST ?action=register — регистрация по email и паролю
POST ?action=login — вход по email и паролю, возвращает токен сессии
POST ?action=logout — выход (деактивирует сессию)
GET  ?action=me — получить данные текущего пользователя по токену
"""

import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2


SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p99527936_nova_evolyutsiya")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def json_response(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    token = (event.get("headers") or {}).get("X-Auth-Token", "")

    if action == "register" and method == "POST":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        name = body.get("name", "").strip()

        if not email or not password:
            return json_response({"error": "Email и пароль обязательны"}, 400)
        if len(password) < 6:
            return json_response({"error": "Пароль должен быть не менее 6 символов"}, 400)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return json_response({"error": "Пользователь с таким email уже существует"}, 409)

        pwd_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
            (email, pwd_hash, name or None),
        )
        user_id = cur.fetchone()[0]
        session_token = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, session_token, expires),
        )
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "token": session_token,
            "user": {"id": user_id, "email": email, "name": name or ""},
        })

    elif action == "login" and method == "POST":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return json_response({"error": "Email и пароль обязательны"}, 400)

        conn = get_conn()
        cur = conn.cursor()
        pwd_hash = hash_password(password)
        cur.execute(
            f"SELECT id, email, name FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, pwd_hash),
        )
        user = cur.fetchone()
        if not user:
            cur.close()
            conn.close()
            return json_response({"error": "Неверный email или пароль"}, 401)

        user_id, user_email, user_name = user
        session_token = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, session_token, expires),
        )
        conn.commit()
        cur.close()
        conn.close()

        return json_response({
            "token": session_token,
            "user": {"id": user_id, "email": user_email, "name": user_name or ""},
        })

    elif action == "me" and method == "GET":
        if not token:
            return json_response({"error": "Не авторизован"}, 401)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT u.id, u.email, u.name FROM {SCHEMA}.users u
                JOIN {SCHEMA}.sessions s ON s.user_id = u.id
                WHERE s.token = %s AND s.expires_at > NOW()""",
            (token,),
        )
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            return json_response({"error": "Сессия недействительна"}, 401)

        return json_response({"user": {"id": user[0], "email": user[1], "name": user[2] or ""}})

    elif action == "logout" and method == "POST":
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s",
                (token,),
            )
            conn.commit()
            cur.close()
            conn.close()
        return json_response({"ok": True})

    return json_response({"error": "Неизвестное действие"}, 404)
