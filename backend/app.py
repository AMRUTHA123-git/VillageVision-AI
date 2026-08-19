import os
import re
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'village_vision.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Users table to persist registered and logged in users with locked roles
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            identifier TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_phone(phone):
    # 10-digit Indian mobile number format (starts with 6-9)
    pattern = r'^[6-9]\d{9}$'
    return re.match(pattern, phone.strip()) is not None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "VillageVision AI Backend",
        "version": "1.0.0"
    }), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    full_name = data.get('fullName', '').strip()
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '').strip()
    role = data.get('role', '').strip()

    valid_roles = [
        "Citizen", 
        "NGO / Volunteer", 
        "Government Authority", 
        "Donor", 
        "Business / Entrepreneur"
    ]

    # Server side validation
    if not full_name:
        return jsonify({"success": False, "error": "Full Name is required."}), 400

    if not identifier:
        return jsonify({"success": False, "error": "Email or Phone Number is required."}), 400

    # Validate email OR phone
    clean_phone = re.sub(r'[\s\-\(\)\+]', '', identifier)
    if not (is_valid_email(identifier) or is_valid_phone(clean_phone)):
        return jsonify({
            "success": False, 
            "error": "Invalid email address or 10-digit mobile number."
        }), 400

    if not password:
        return jsonify({"success": False, "error": "Password is required."}), 400

    if role not in valid_roles:
        return jsonify({"success": False, "error": "Please select a valid stakeholder role."}), 400

    # Persist or update user in SQLite database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (full_name, identifier, role)
        VALUES (?, ?, ?)
        ON CONFLICT(identifier) DO UPDATE SET full_name = excluded.full_name, role = excluded.role
    ''', (full_name, identifier, role))
    conn.commit()

    cursor.execute('SELECT id, full_name, identifier, role, created_at FROM users WHERE identifier = ?', (identifier,))
    user_row = cursor.fetchone()
    conn.close()

    user_data = {
        "id": user_row["id"],
        "fullName": user_row["full_name"],
        "identifier": user_row["identifier"],
        "role": user_row["role"]
    }

    return jsonify({
        "success": True,
        "message": f"Welcome back, {user_data['fullName']}!",
        "user": user_data
    }), 200

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
    print("Starting VillageVision AI Flask Backend on http://localhost:5000")
    app.run(debug=True, port=5000)
