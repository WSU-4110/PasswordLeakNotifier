from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

from breach_service import BreachLookupService  

load_dotenv()
app = Flask(__name__)

# API key pulled from .env
HIBP_API_KEY = os.getenv("HIBP_API_KEY", "")
breach_service = BreachLookupService(api_key=HIBP_API_KEY)


@app.route("/check-email", methods=["GET"])
def check_email() -> tuple:
    email = request.args.get("email", "").strip()
    if not email:
        return jsonify(error="Email is required"), 400

    try:
        breaches = breach_service.fetch_breaches(email)

        result = {
            "email": email,
            "last_checked": breach_service.stamp(),
            "breach_count": len(breaches),
            "breaches": [
                {
                    "name": b["Name"],
                    "date": b["BreachDate"],
                    "link": f'https://haveibeenpwned.com/PwnedWebsites#{b["Name"]}',
                }
                for b in breaches
            ],
        }
        return jsonify(result)

    except RuntimeError:
        return jsonify(error="Service temporarily unavailable"), 503
    except Exception as exc:
        return jsonify(error=str(exc)), 500


if __name__ == "__main__":
    app.run(debug=True)
