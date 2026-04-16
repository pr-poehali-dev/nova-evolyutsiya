"""
API для личного кабинета «В тонусе»: расписание тренировок и дневник питания.
GET  ?action=workouts        — список тренировок пользователя
POST ?action=workout-add     — добавить тренировку
POST ?action=workout-delete  — удалить тренировку
GET  ?action=nutrition       — записи дневника питания
POST ?action=nutrition-add   — добавить запись питания
POST ?action=nutrition-delete — удалить запись питания
"""

import json
import os
import psycopg2
from datetime import datetime

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p99527936_nova_evolyutsiya")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def json_response(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def get_user_id(token: str, conn):
    cur = conn.cursor()
    cur.execute(
        f"""SELECT u.id FROM {SCHEMA}.users u
            JOIN {SCHEMA}.sessions s ON s.user_id = u.id
            WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,),
    )
    row = cur.fetchone()
    cur.close()
    return row[0] if row else None


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
    if not token:
        return json_response({"error": "Не авторизован"}, 401)

    conn = get_conn()
    user_id = get_user_id(token, conn)
    if not user_id:
        conn.close()
        return json_response({"error": "Сессия недействительна"}, 401)

    cur = conn.cursor()

    # --- ТРЕНИРОВКИ ---
    if action == "workouts" and method == "GET":
        cur.execute(
            f"""SELECT id, title, workout_date, start_time, duration_minutes, notes
                FROM {SCHEMA}.workouts
                WHERE user_id = %s ORDER BY workout_date DESC, start_time""",
            (user_id,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        workouts = [
            {"id": r[0], "title": r[1], "date": str(r[2]), "time": str(r[3]) if r[3] else "", "duration": r[4], "notes": r[5] or ""}
            for r in rows
        ]
        return json_response({"workouts": workouts})

    elif action == "workout-add" and method == "POST":
        title = body.get("title", "").strip()
        date = body.get("date", "")
        time = body.get("time", "") or None
        duration = body.get("duration") or None
        notes = body.get("notes", "").strip() or None
        if not title or not date:
            cur.close(); conn.close()
            return json_response({"error": "Название и дата обязательны"}, 400)
        cur.execute(
            f"""INSERT INTO {SCHEMA}.workouts (user_id, title, workout_date, start_time, duration_minutes, notes)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
            (user_id, title, date, time, duration, notes),
        )
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return json_response({"id": new_id, "ok": True})

    elif action == "workout-delete" and method == "POST":
        wid = body.get("id")
        cur.execute(f"UPDATE {SCHEMA}.workouts SET user_id = user_id WHERE id = %s AND user_id = %s RETURNING id", (wid, user_id))
        if not cur.fetchone():
            cur.close(); conn.close()
            return json_response({"error": "Не найдено"}, 404)
        cur.execute(f"DELETE FROM {SCHEMA}.workouts WHERE id = %s AND user_id = %s", (wid, user_id))
        conn.commit(); cur.close(); conn.close()
        return json_response({"ok": True})

    # --- ПИТАНИЕ ---
    elif action == "nutrition" and method == "GET":
        date_filter = qs.get("date", "")
        if date_filter:
            cur.execute(
                f"""SELECT id, entry_date, meal_type, food_name, calories, proteins, fats, carbs, notes
                    FROM {SCHEMA}.nutrition_diary
                    WHERE user_id = %s AND entry_date = %s ORDER BY created_at""",
                (user_id, date_filter),
            )
        else:
            cur.execute(
                f"""SELECT id, entry_date, meal_type, food_name, calories, proteins, fats, carbs, notes
                    FROM {SCHEMA}.nutrition_diary
                    WHERE user_id = %s ORDER BY entry_date DESC, created_at DESC LIMIT 50""",
                (user_id,),
            )
        rows = cur.fetchall()
        cur.close(); conn.close()
        entries = [
            {"id": r[0], "date": str(r[1]), "meal_type": r[2] or "", "food_name": r[3],
             "calories": r[4], "proteins": float(r[5]) if r[5] else None,
             "fats": float(r[6]) if r[6] else None, "carbs": float(r[7]) if r[7] else None, "notes": r[8] or ""}
            for r in rows
        ]
        return json_response({"entries": entries})

    elif action == "nutrition-add" and method == "POST":
        date = body.get("date", "")
        food_name = body.get("food_name", "").strip()
        meal_type = body.get("meal_type", "").strip() or None
        calories = body.get("calories") or None
        proteins = body.get("proteins") or None
        fats = body.get("fats") or None
        carbs = body.get("carbs") or None
        notes = body.get("notes", "").strip() or None
        if not date or not food_name:
            cur.close(); conn.close()
            return json_response({"error": "Дата и название блюда обязательны"}, 400)
        cur.execute(
            f"""INSERT INTO {SCHEMA}.nutrition_diary
                (user_id, entry_date, meal_type, food_name, calories, proteins, fats, carbs, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (user_id, date, meal_type, food_name, calories, proteins, fats, carbs, notes),
        )
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return json_response({"id": new_id, "ok": True})

    elif action == "nutrition-delete" and method == "POST":
        nid = body.get("id")
        cur.execute(f"DELETE FROM {SCHEMA}.nutrition_diary WHERE id = %s AND user_id = %s", (nid, user_id))
        conn.commit(); cur.close(); conn.close()
        return json_response({"ok": True})

    cur.close(); conn.close()
    return json_response({"error": "Неизвестное действие"}, 404)
