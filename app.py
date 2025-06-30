from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from reset_links import RESET_LINKS  

load_dotenv()
app = Flask(__name__)

HIBP_API_KEY = os.getenv("HIBP_API_KEY")

@app.route('/check-email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    headers = {
        "hibp-api-key": HIBP_API_KEY,
        "User-Agent": "Pwned-Notifier-School-Project"
    }

    try:
        resp = requests.get(
            f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}",
            headers=headers,
            params={"truncateResponse": False}
        )

        if resp.status_code == 404:
            return jsonify({"email": email, "breach_count": 0, "breaches": []})

        if resp.status_code != 200:
            return jsonify({"error": "Failed to fetch breach data"}), 500

        breaches = resp.json()
        result = {
            "email": email,
            "breach_count": len(breaches),
            "breaches": []
        }

        for b in breaches:
            domain = (b.get("Domain") or "").lower()
            reset_url = RESET_LINKS.get(domain)

            entry = {
                "name": b["Name"],
                "date": b["BreachDate"],
                "hibp_link": f"https://haveibeenpwned.com/PwnedWebsites#{b['Name']}"
            }

            if reset_url:
                entry["reset_link"] = reset_url
            else:
                entry["error"] = f"No reset link found for {domain or b['Name']}"

            result["breaches"].append(entry)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
