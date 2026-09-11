import os
import re
import sqlite3
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes so frontend (local port 3000, Vercel, or custom domains) can communicate smoothly
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]
}})

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'village_vision.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Initial Demo Accounts
DEFAULT_ACCOUNTS = [
    {
        "fullName": "Ramesh Sharma",
        "email": "citizen@villagevision.ai",
        "mobileNumber": "9123456780",
        "password": "Citizen@123",
        "role": "Citizen"
    },
    {
        "fullName": "Seva Foundation",
        "email": "ngo@villagevision.ai",
        "mobileNumber": "9988776655",
        "password": "Ngo@123",
        "role": "NGO / Volunteer"
    },
    {
        "fullName": "Youth For Andhra NGO",
        "email": "ngo2@villagevision.ai",
        "mobileNumber": "9988776644",
        "password": "Ngo2@123",
        "role": "NGO / Volunteer"
    }
]

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            identifier TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            password TEXT,
            mobile_number TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Add missing columns to existing users table if needed
    cursor.execute("PRAGMA table_info(users)")
    existing_user_cols = [row[1] for row in cursor.fetchall()]
    if 'password' not in existing_user_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN password TEXT")
    if 'mobile_number' not in existing_user_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN mobile_number TEXT")

    # Seed Default Users if empty
    cursor.execute("SELECT COUNT(*) as count FROM users")
    if cursor.fetchone()["count"] == 0:
        for acc in DEFAULT_ACCOUNTS:
            cursor.execute('''
                INSERT INTO users (full_name, identifier, role, password, mobile_number)
                VALUES (?, ?, ?, ?, ?)
            ''', (acc["fullName"], acc["email"], acc["role"], acc["password"], acc.get("mobileNumber", "")))
        conn.commit()

    # 2. Issues Table (Pure Single Source of Truth - ZERO Fake/Demo Issues)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS issues (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            photo TEXT,
            before_photo TEXT,
            after_photo TEXT,
            state TEXT DEFAULT 'Andhra Pradesh',
            district TEXT DEFAULT 'Visakhapatnam',
            village TEXT NOT NULL,
            area TEXT NOT NULL,
            pincode TEXT,
            latitude REAL,
            longitude REAL,
            priority TEXT DEFAULT 'Medium',
            status TEXT DEFAULT 'Open',
            reported_by TEXT NOT NULL,
            reported_by_user_id TEXT,
            reported_by_identifier TEXT,
            reported_by_email TEXT,
            reported_by_role TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            adopted INTEGER DEFAULT 0,
            adopted_by TEXT,
            adopted_by_user_id TEXT,
            adopted_by_role TEXT,
            adopted_date TEXT,
            adopted_time TEXT,
            adopted_at TEXT,
            resolved INTEGER DEFAULT 0,
            resolved_by TEXT,
            resolved_by_user_id TEXT,
            resolved_by_role TEXT,
            resolved_date TEXT,
            resolved_time TEXT,
            resolved_at TEXT,
            solution_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Add missing columns to existing issues table if needed
    cursor.execute("PRAGMA table_info(issues)")
    existing_issue_cols = [row[1] for row in cursor.fetchall()]
    if 'reported_by_user_id' not in existing_issue_cols:
        cursor.execute("ALTER TABLE issues ADD COLUMN reported_by_user_id TEXT")
    if 'reported_by_identifier' not in existing_issue_cols:
        cursor.execute("ALTER TABLE issues ADD COLUMN reported_by_identifier TEXT")
    if 'reported_by_email' not in existing_issue_cols:
        cursor.execute("ALTER TABLE issues ADD COLUMN reported_by_email TEXT")

    conn.commit()
    conn.close()

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, (email or '').strip()))

def is_valid_phone(phone):
    pattern = r'^[6-9]\d{9}$'
    clean = re.sub(r'[\s\-\(\)\+]', '', (phone or '').strip())
    return bool(re.match(pattern, clean))

def format_issue_row(row):
    if not row:
        return None
    d = dict(row)
    is_adopted = bool(d.get("adopted", 0))
    is_resolved = bool(d.get("resolved", 0)) or (d.get("status") == "Resolved")
    
    return {
        "id": d.get("id"),
        "category": d.get("category"),
        "description": d.get("description"),
        "photo": d.get("photo"),
        "beforePhoto": d.get("before_photo") or d.get("photo"),
        "afterPhoto": d.get("after_photo"),
        "state": d.get("state") or "Andhra Pradesh",
        "district": d.get("district") or "Visakhapatnam",
        "village": d.get("village"),
        "area": d.get("area"),
        "pincode": str(d.get("pincode") or ""),
        "latitude": float(d.get("latitude")) if d.get("latitude") is not None else 17.8912,
        "longitude": float(d.get("longitude")) if d.get("longitude") is not None else 83.4542,
        "priority": d.get("priority") or "Medium",
        "status": d.get("status") or ("Resolved" if is_resolved else ("Adopted" if is_adopted else "Open")),
        "reportedBy": d.get("reported_by"),
        "reportedByUserId": d.get("reported_by_user_id"),
        "reportedByIdentifier": d.get("reported_by_identifier") or d.get("reported_by_email"),
        "reportedByEmail": d.get("reported_by_email") or d.get("reported_by_identifier"),
        "reportedByRole": d.get("reported_by_role") or "Citizen",
        "date": d.get("date"),
        "time": d.get("time"),
        "adopted": is_adopted,
        "adoptedBy": d.get("adopted_by"),
        "adoptedByName": d.get("adopted_by"),
        "organization": d.get("adopted_by"),
        "adoptedByUserId": d.get("adopted_by_user_id"),
        "adoptedByRole": d.get("adopted_by_role"),
        "adoptedDate": d.get("adopted_date"),
        "adoptedTime": d.get("adopted_time"),
        "adoptedAt": d.get("adopted_at"),
        "resolved": is_resolved,
        "resolvedBy": d.get("resolved_by"),
        "solvedBy": d.get("resolved_by"),
        "resolvedByUserId": d.get("resolved_by_user_id"),
        "resolvedByRole": d.get("resolved_by_role"),
        "resolvedDate": d.get("resolved_date"),
        "solvedDate": d.get("resolved_date"),
        "resolvedTime": d.get("resolved_time"),
        "solvedTime": d.get("resolved_time"),
        "resolvedAt": d.get("resolved_at"),
        "solvedAt": d.get("resolved_at"),
        "solutionDescription": d.get("solution_description"),
        "createdAt": d.get("created_at")
    }

# =========================================================================
# ROUTES: HEALTH & AUTH
# =========================================================================

@app.route('/', methods=['GET'])
@app.route('/api', methods=['GET'])
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
    identifier = data.get('identifier', '').strip() or data.get('email', '').strip()
    password = data.get('password', '').strip()
    role = data.get('role', '').strip()

    valid_roles = ["Citizen", "NGO / Volunteer", "Volunteer", "NGO"]

    if not identifier:
        return jsonify({"success": False, "error": "Email address is required."}), 400

    clean_phone = re.sub(r'[\s\-\(\)\+]', '', identifier)
    if not (is_valid_email(identifier) or is_valid_phone(clean_phone)):
        return jsonify({
            "success": False, 
            "error": "Please enter a valid email address or 10-digit mobile number."
        }), 400

    if not password:
        return jsonify({"success": False, "error": "Password is required."}), 400

    if not role or role not in valid_roles:
        return jsonify({"success": False, "error": "Please select a valid role (Citizen or NGO / Volunteer)."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Look up user by identifier in SQLite database
    cursor.execute('SELECT * FROM users WHERE lower(identifier) = lower(?)', (identifier,))
    user_row = cursor.fetchone()

    if user_row:
        # Check password if one was set
        stored_password = user_row["password"]
        if stored_password and stored_password != password:
            conn.close()
            return jsonify({
                "success": False,
                "error": "Incorrect password. Please try again."
            }), 400

        # Check role match
        user_role = user_row["role"]
        is_citizen_match = ("citizen" in role.lower() and "citizen" in user_role.lower())
        is_ngo_match = (("ngo" in role.lower() or "volunteer" in role.lower()) and 
                        ("ngo" in user_role.lower() or "volunteer" in user_role.lower()))
        
        if not (is_citizen_match or is_ngo_match or role.lower() == user_role.lower()):
            conn.close()
            return jsonify({
                "success": False,
                "error": f"Your account is registered as '{user_role}', not '{role}'."
            }), 400

        user_data = {
            "id": f"USR-{user_row['id']}",
            "fullName": user_row["full_name"],
            "identifier": user_row["identifier"],
            "email": user_row["identifier"],
            "role": user_row["role"]
        }
        conn.close()
        return jsonify({
            "success": True,
            "message": f"Welcome back, {user_data['fullName']}!",
            "user": user_data
        }), 200

    else:
        # User not found in DB -> Register user automatically if full_name is supplied, or return prompt
        resolved_name = full_name if full_name else identifier.split('@')[0].replace('.', ' ').title()
        cursor.execute('''
            INSERT INTO users (full_name, identifier, role, password)
            VALUES (?, ?, ?, ?)
        ''', (resolved_name, identifier, role, password))
        conn.commit()

        cursor.execute('SELECT * FROM users WHERE lower(identifier) = lower(?)', (identifier,))
        new_row = cursor.fetchone()
        conn.close()

        user_data = {
            "id": f"USR-{new_row['id']}",
            "fullName": new_row["full_name"],
            "identifier": new_row["identifier"],
            "email": new_row["identifier"],
            "role": new_row["role"]
        }
        return jsonify({
            "success": True,
            "message": f"Welcome, {user_data['fullName']}!",
            "user": user_data
        }), 200

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    full_name = data.get('fullName', '').strip()
    email = data.get('email', '').strip()
    mobile_number = data.get('mobileNumber', '').strip()
    password = data.get('password', '').strip()
    role = data.get('role', 'Citizen').strip()

    valid_roles = ["Citizen", "NGO / Volunteer", "Volunteer", "NGO"]

    if not full_name:
        return jsonify({"success": False, "error": "Full name is required."}), 400

    if not email or not is_valid_email(email):
        return jsonify({"success": False, "error": "Please enter a valid email address."}), 400

    if not password or len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters long."}), 400

    if role not in valid_roles:
        return jsonify({"success": False, "error": "Please select a valid role."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM users WHERE lower(identifier) = lower(?)', (email,))
    existing = cursor.fetchone()

    if existing:
        conn.close()
        return jsonify({"success": False, "error": "An account with this email already exists. Please login."}), 400

    cursor.execute('''
        INSERT INTO users (full_name, identifier, role, password, mobile_number)
        VALUES (?, ?, ?, ?, ?)
    ''', (full_name, email, role, password, mobile_number))
    conn.commit()

    cursor.execute('SELECT * FROM users WHERE lower(identifier) = lower(?)', (email,))
    user_row = cursor.fetchone()
    conn.close()

    user_data = {
        "id": f"USR-{user_row['id']}",
        "fullName": user_row["full_name"],
        "email": user_row["identifier"],
        "identifier": user_row["identifier"],
        "role": user_row["role"]
    }

    return jsonify({
        "success": True,
        "message": "Account created successfully! Please login with your credentials.",
        "user": user_data
    }), 201

@app.route('/api/delete-account', methods=['POST'])
@app.route('/api/users/<identifier>', methods=['DELETE'])
def delete_account(identifier=None):
    if not identifier:
        data = request.get_json() or {}
        identifier = data.get('identifier', '').strip() or data.get('email', '').strip()

    if not identifier:
        return jsonify({"success": False, "error": "Identifier or email is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE lower(identifier) = lower(?)', (identifier,))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Account for {identifier} permanently deleted from database."
    }), 200

# =========================================================================
# ROUTES: ISSUE MANAGEMENT
# =========================================================================

@app.route('/api/issues', methods=['GET'])
def get_issues():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM issues ORDER BY created_at DESC, id DESC')
    rows = cursor.fetchall()
    conn.close()

    issues = [format_issue_row(r) for r in rows]
    return jsonify(issues), 200

@app.route('/api/issues', methods=['POST'])
def create_issue():
    data = request.get_json() or {}

    category = data.get('category', 'Road Damage').strip()
    description = data.get('description', '').strip()
    photo = data.get('photo')
    village = data.get('village', 'Bheemunipatnam').strip()
    area = data.get('area', 'Main Road').strip()
    pincode = str(data.get('pincode', '531163')).strip()
    priority = data.get('priority', 'Medium').strip()
    reported_by = data.get('reportedBy', 'Authenticated Citizen').strip()
    reported_by_user_id = str(data.get('reportedByUserId') or '').strip()
    reported_by_identifier = str(data.get('reportedByIdentifier') or data.get('reportedByEmail') or '').strip()
    reported_by_email = str(data.get('reportedByEmail') or data.get('reportedByIdentifier') or '').strip()
    reported_by_role = data.get('reportedByRole', 'Citizen').strip()
    
    try:
        latitude = float(data.get('latitude', 17.8912))
        longitude = float(data.get('longitude', 83.4542))
    except (TypeError, ValueError):
        latitude = 17.8912
        longitude = 83.4542

    if not description:
        return jsonify({"success": False, "error": "Problem description is required."}), 400

    if not village:
        return jsonify({"success": False, "error": "Village / Area selection is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate sequential unique Issue ID
    cursor.execute('SELECT id FROM issues')
    existing_ids = [r["id"] for r in cursor.fetchall()]
    max_num = 1000
    for eid in existing_ids:
        num_part = re.sub(r'\D', '', str(eid))
        if num_part:
            max_num = max(max_num, int(num_part))
    
    new_id = f"VV-{max_num + 1}"
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')
    time_str = now.strftime('%I:%M %p')

    cursor.execute('''
        INSERT INTO issues (
            id, category, description, photo, before_photo,
            state, district, village, area, pincode,
            latitude, longitude, priority, status,
            reported_by, reported_by_user_id, reported_by_identifier, reported_by_email, reported_by_role,
            date, time, adopted, resolved
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
    ''', (
        new_id, category, description, photo, photo,
        data.get('state', 'Andhra Pradesh'), data.get('district', 'Visakhapatnam'),
        village, area, pincode, latitude, longitude,
        priority, 'Open',
        reported_by, reported_by_user_id, reported_by_identifier, reported_by_email, reported_by_role,
        date_str, time_str
    ))
    conn.commit()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (new_id,))
    new_row = cursor.fetchone()
    conn.close()

    formatted = format_issue_row(new_row)
    return jsonify({
        "success": True,
        "message": f"Issue {new_id} successfully reported and saved.",
        "issue": formatted
    }), 201

@app.route('/api/issues/my-reports', methods=['GET'])
def get_my_reports():
    identifier = (request.args.get('identifier') or '').strip().lower()
    email = (request.args.get('email') or '').strip().lower()
    user_id = (request.args.get('userId') or request.args.get('user_id') or '').strip().lower()
    full_name = (request.args.get('fullName') or request.args.get('full_name') or request.args.get('name') or '').strip().lower()

    target_ident = identifier or email
    target_name = full_name

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM issues ORDER BY created_at DESC, id DESC')
    rows = cursor.fetchall()
    conn.close()

    formatted = [format_issue_row(r) for r in rows]

    my_issues = []
    for iss in formatted:
        iss_ident = (iss.get("reportedByIdentifier") or iss.get("reportedByEmail") or "").lower().strip()
        iss_uid = (iss.get("reportedByUserId") or "").lower().strip()
        iss_name = (iss.get("reportedBy") or "").lower().strip()

        is_match = False
        if target_ident and iss_ident and target_ident == iss_ident:
            is_match = True
        elif user_id and iss_uid and user_id == iss_uid:
            is_match = True
        elif target_name and iss_name and target_name == iss_name:
            is_match = True
        elif not target_ident and not user_id and not target_name:
            is_match = True

        if is_match:
            my_issues.append(iss)

    return jsonify(my_issues), 200

@app.route('/api/reverse-geocode', methods=['GET'])
def reverse_geocode():
    lat_str = request.args.get('lat')
    lon_str = request.args.get('lon') or request.args.get('lng')

    if not lat_str or not lon_str:
        return jsonify({"success": False, "error": "Latitude and longitude query parameters are required."}), 400

    try:
        lat = float(lat_str)
        lon = float(lon_str)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid latitude or longitude coordinates."}), 400

    nominatim_url = f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={lat}&lon={lon}&addressdetails=1"
    headers = {
        "User-Agent": "VillageVision-AI/1.0 (Visakhapatnam Civic Tech; Contact: info@villagevision.ai)",
        "Accept": "application/json"
    }

    try:
        import urllib.request
        import json as py_json
        req = urllib.request.Request(nominatim_url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = py_json.loads(response.read().decode('utf-8'))
            address = res_data.get('address', {})
            display_name = res_data.get('display_name', '')

            # Extract real postcode without guessing
            postcode = address.get('postcode')
            pincode = None
            if postcode:
                clean_pin = re.sub(r'\D', '', str(postcode))
                if len(clean_pin) == 6:
                    pincode = clean_pin

            suburb = address.get('suburb') or address.get('village') or address.get('town') or address.get('neighbourhood') or address.get('hamlet') or address.get('residential')
            road = address.get('road') or address.get('pedestrian') or address.get('street')
            district = address.get('state_district') or address.get('county') or address.get('city') or 'Visakhapatnam'
            state = address.get('state') or 'Andhra Pradesh'

            # Match Visakhapatnam villages
            matched_village = None
            visakha_villages = [
                'Bheemunipatnam', 'Anandapuram', 'Padmanabham', 'Pendurthi', 
                'Sabbavaram', 'Gajuwaka', 'Visakhapatnam Rural'
            ]
            full_text = f"{suburb or ''} {address.get('county', '')} {address.get('subdistrict', '')} {display_name}".lower()
            for v in visakha_villages:
                if v.lower() in full_text or (v == 'Bheemunipatnam' and 'bheemili' in full_text):
                    matched_village = v
                    break

            if not matched_village and suburb:
                matched_village = suburb

            area_parts = []
            if road:
                area_parts.append(road)
            if suburb and suburb != matched_village:
                area_parts.append(suburb)
            
            detected_area = ", ".join(area_parts) if area_parts else (road or suburb or display_name.split(',')[0] if display_name else "Detected Area")

            return jsonify({
                "success": True,
                "latitude": lat,
                "longitude": lon,
                "village": matched_village or "Bheemunipatnam",
                "area": detected_area,
                "pincode": pincode,
                "district": district,
                "state": state,
                "displayName": display_name,
                "address": address
            }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Reverse geocoding failed: {str(e)}",
            "latitude": lat,
            "longitude": lon
        }), 500

@app.route('/api/issues/<issue_id>/adopt', methods=['POST'])
def adopt_issue(issue_id):
    data = request.get_json() or {}
    user_obj = data.get('adopterUser') or data.get('user') or {}
    adopter_name = (data.get('adoptedByName') or data.get('organization') or data.get('adoptedBy') or user_obj.get('fullName') or user_obj.get('name') or 'NGO / Volunteer Organization').strip()
    adopter_user_id = str(data.get('adoptedByUserId') or user_obj.get('id') or '').strip()
    adopter_role = (data.get('adoptedByRole') or user_obj.get('role') or 'NGO / Volunteer').strip()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (issue_id,))
    target = cursor.fetchone()

    if not target:
        conn.close()
        return jsonify({"success": False, "error": "Issue not found."}), 404

    # Anti-Duplicate Lock: Check if already adopted
    if target["adopted"] == 1 or target["status"] == "Adopted" or target["status"] == "Resolved":
        current_adopter = target["adopted_by"] or "another organization"
        conn.close()
        return jsonify({
            "success": False,
            "error": f"This issue is already adopted by {current_adopter}. Duplicate adoption is prevented.",
            "issue": format_issue_row(target)
        }), 400

    now = datetime.now()
    date_str = now.strftime('%d %b %Y')
    time_str = now.strftime('%I:%M %p')
    adopted_at_str = f"{date_str}, {time_str}"

    cursor.execute('''
        UPDATE issues
        SET adopted = 1,
            status = 'Adopted',
            adopted_by = ?,
            adopted_by_user_id = ?,
            adopted_by_role = ?,
            adopted_date = ?,
            adopted_time = ?,
            adopted_at = ?
        WHERE id = ?
    ''', (adopter_name, adopter_user_id, adopter_role, date_str, time_str, adopted_at_str, issue_id))
    conn.commit()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (issue_id,))
    updated_row = cursor.fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Issue {issue_id} successfully adopted by {adopter_name}.",
        "issue": format_issue_row(updated_row)
    }), 200

@app.route('/api/issues/<issue_id>/after-photo', methods=['POST'])
def add_after_photo(issue_id):
    data = request.get_json() or {}
    after_photo = data.get('afterPhoto', '').strip()
    solution_desc = data.get('solutionDescription', '').strip()
    updated_by = data.get('updatedBy', '').strip()

    if not after_photo:
        return jsonify({"success": False, "error": "After-solution photo is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (issue_id,))
    target = cursor.fetchone()

    if not target:
        conn.close()
        return jsonify({"success": False, "error": "Issue not found."}), 404

    cursor.execute('''
        UPDATE issues
        SET after_photo = ?,
            solution_description = CASE WHEN ? != '' THEN ? ELSE solution_description END
        WHERE id = ?
    ''', (after_photo, solution_desc, solution_desc, issue_id))
    conn.commit()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (issue_id,))
    updated_row = cursor.fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": "After-solution photo uploaded successfully.",
        "issue": format_issue_row(updated_row)
    }), 200

@app.route('/api/issues/<issue_id>/resolve', methods=['POST'])
def resolve_issue(issue_id):
    data = request.get_json() or {}
    solution_photo = (data.get('solutionPhoto', '') or data.get('afterPhoto', '')).strip()
    solution_desc = data.get('solutionDescription', '').strip()
    user_obj = data.get('resolvedByUser') or data.get('user') or {}
    resolved_by = (data.get('resolvedByName') or data.get('resolvedBy') or data.get('solvedBy') or user_obj.get('fullName') or user_obj.get('name') or '').strip()
    resolved_by_user_id = str(data.get('resolvedByUserId') or user_obj.get('id') or '').strip()
    resolved_by_role = (data.get('resolvedByRole') or user_obj.get('role') or 'NGO / Volunteer').strip()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (issue_id,))
    target = cursor.fetchone()

    if not target:
        conn.close()
        return jsonify({"success": False, "error": "Issue not found."}), 404

    # Determine effective after-photo (must not be empty)
    effective_after_photo = solution_photo if solution_photo else (target["after_photo"] or "")
    if not effective_after_photo:
        conn.close()
        return jsonify({
            "success": False,
            "error": "An After-Solution photo is mandatory before marking this issue as Resolved."
        }), 400

    now = datetime.now()
    date_str = now.strftime('%d %b %Y')
    time_str = now.strftime('%I:%M %p')
    resolved_at_str = f"{date_str}, {time_str}"
    
    desc_val = solution_desc if solution_desc else (target["solution_description"] or "Community problem successfully addressed and verified by NGO / Volunteer intervention.")
    solver_val = resolved_by if resolved_by else (target["adopted_by"] or "NGO / Volunteer")

    cursor.execute('''
        UPDATE issues
        SET status = 'Resolved',
            resolved = 1,
            after_photo = ?,
            solution_description = ?,
            resolved_by = ?,
            resolved_by_user_id = ?,
            resolved_by_role = ?,
            resolved_date = ?,
            resolved_time = ?,
            resolved_at = ?
        WHERE id = ?
    ''', (
        effective_after_photo, desc_val, solver_val,
        resolved_by_user_id, resolved_by_role, date_str, time_str, resolved_at_str,
        issue_id
    ))
    conn.commit()

    cursor.execute('SELECT * FROM issues WHERE id = ?', (issue_id,))
    updated_row = cursor.fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Issue {issue_id} marked as Resolved successfully.",
        "issue": format_issue_row(updated_row)
    }), 200

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
    print("Starting VillageVision AI Flask Backend on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)

