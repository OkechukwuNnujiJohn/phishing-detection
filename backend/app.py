from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import joblib
import requests
from urllib.parse import urlparse
import socket
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT Setup
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
jwt = JWTManager(app)

try:
    model = joblib.load('phishing_model.pkl')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")

SUGGESTED_DOMAINS = {
    'paypal-security.com': 'paypal.com',
    'goggle.com': 'google.com',
    'amaz0n.net': 'amazon.com'
}

def extract_features(url):
    return [
        len(url),
        int('https' in url),
        url.count('.'),
        url.count('/'),
        sum(c.isdigit() for c in url)
    ]

def resolve_domain_to_ip(domain):
    try:
        return socket.gethostbyname(domain)
    except socket.gaierror:
        return None

def suggest_domain(domain):
    return SUGGESTED_DOMAINS.get(domain, None)

@app.route("/")
def home():
    return jsonify({"message": "Flask API is running"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username == 'admin' and password == 'password':
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/combined-check', methods=['POST'])
@jwt_required()
def combined_check():
    try:
        data = request.get_json()
        url = data.get('url', '')
        if not url:
            return jsonify({"error": "Missing URL parameter"}), 400

        is_phishing_ml = False
        if model:
            features = extract_features(url)
            is_phishing_ml = bool(model.predict([features])[0])

        parsed_url = urlparse(url)
        domain_or_ip = parsed_url.netloc or parsed_url.path
        resolved_ip = resolve_domain_to_ip(domain_or_ip)

        abuse_confidence_score = 0
        is_phishing_abuseipdb = False
        if resolved_ip:
            try:
                abuseipdb_response = requests.get(
                    "https://api.abuseipdb.com/api/v2/check",
                    headers={'Accept': 'application/json', 'Key': ABUSEIPDB_API_KEY},
                    params={'ipAddress': resolved_ip, 'maxAgeInDays': 90},
                    timeout=5
                )
                abuseipdb_response.raise_for_status()
                abuse_data = abuseipdb_response.json()
                abuse_confidence_score = abuse_data.get("data", {}).get("abuseConfidenceScore", 0)
                is_phishing_abuseipdb = abuse_confidence_score > 50
            except requests.exceptions.RequestException as e:
                print(f"AbuseIPDB API Error: {e}")

        is_phishing_google = False
        try:
            google_response = requests.post(
                f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_API_KEY}",
                json={
                    "client": {"clientId": "your-client-id", "clientVersion": "1.0"},
                    "threatInfo": {
                        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
                        "platformTypes": ["ANY_PLATFORM"],
                        "threatEntryTypes": ["URL"],
                        "threatEntries": [{"url": url}]
                    }
                },
                timeout=5
            )
            google_result = google_response.json()
            is_phishing_google = bool(google_result.get("matches", []))
        except requests.exceptions.RequestException as e:
            print(f"Google Safe Browsing API Error: {e}")

        suggested_domain = suggest_domain(domain_or_ip)
        final_result = is_phishing_ml or is_phishing_abuseipdb or is_phishing_google

        return jsonify({
            "url": url,
            "isPhishingML": is_phishing_ml,
            "isPhishingAbuseIPDB": is_phishing_abuseipdb,
            "isPhishingGoogle": is_phishing_google,
            "finalResult": final_result,
            "abuseConfidenceScore": abuse_confidence_score,
            "suggestion": suggested_domain
        }), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f"External API request error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({'error': f"Server error: {str(e)}"}), 500

@app.route('/api/stats', methods=['GET'])
@jwt_required()
def stats():
    return jsonify({
        "phishingCount": 5,
        "safeCount": 10
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
