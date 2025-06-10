from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  
app = Flask(__name__)

# HIBP API key from environment file
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
        # fetch breaches from HIBP API
        response = requests.get(
            f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}",
            headers=headers,
            params={"truncateResponse": False}
        )
        
        if response.status_code == 200:
            breaches = response.json()
            # extract data (number, dates, links)
            result = {
                "email": email,
                "breach_count": len(breaches),
                "breaches": [
                    {
                        "name": breach["Name"],
                        "date": breach["BreachDate"],
                        "link": f'https://haveibeenpwned.com/PwnedWebsites#{breach["Name"]}'
                    }
                    for breach in breaches
                ]
            }
            return jsonify(result)
        
        elif response.status_code == 404:
            return jsonify({"email": email, "breach_count": 0, "breaches": []})
        
        else:
            return jsonify({"error": "Failed to fetch data"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
