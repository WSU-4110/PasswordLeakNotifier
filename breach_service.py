import requests
from datetime import datetime, timezone


class BreachLookupService:
    """
    Facade that hides the Have I Been Pwned HTTP call -
    keeps network code out of your Flask route.
    """
    _URL = "https://haveibeenpwned.com/api/v3/breachedaccount/{email}"

    def __init__(self, api_key: str, timeout_sec: int = 8) -> None:
        self._timeout = timeout_sec
        self._session = requests.Session()
        self._session.headers.update(
            {
                "hibp-api-key": api_key,
                "user-agent": "PLN student project",
            }
        )

    def fetch_breaches(self, email: str) -> list[dict]:
        url = self._URL.format(email=email)
        try:
            resp = self._session.get(url, timeout=self._timeout, params={"truncateResponse": False})
            if resp.status_code == 404:          # no breaches for that account
                return []
            resp.raise_for_status()
            return resp.json()                   # list of breach dictionaries
        except requests.RequestException as exc:
            raise RuntimeError("lookup_failed") from exc

    @staticmethod
    def stamp() -> str:
        """UTC ISO-8601 timestamp for a ‘last checked’ field."""
        return datetime.now(timezone.utc).isoformat()

