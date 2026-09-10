"""The Coaching Engine API.

Loading .env here, in the package __init__, is deliberate. providers.py reads
its keys at import time, so configuration has to be in the environment before
any submodule is imported. Doing it here means the service is self-configuring
however it is launched: uvicorn from a shell, docker compose, or a test.

The alternative, relying on the launcher to export the right variables, fails
silently: the service starts, /health says the database is up, and every AI
call returns 503 because a key was never set.
"""

from pathlib import Path

from dotenv import load_dotenv

# services/api/app/__init__.py -> repo root
_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(_ROOT / ".env", override=False)
