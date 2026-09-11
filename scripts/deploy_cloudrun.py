"""Deploy the API to Cloud Run, without needing the gcloud SDK.

    python scripts/deploy_cloudrun.py --check     # permissions only, changes nothing
    python scripts/deploy_cloudrun.py             # build, push, deploy

Uses the service account JSON in the repo root and talks to the Cloud Run and
Artifact Registry REST APIs directly, so there is nothing to install beyond
Docker, which is already required to run this project locally.

WHY CLOUD RUN AND NOT RENDER
    Render's free tier sleeps after fifteen idle minutes and takes 25 to 50
    seconds to wake. Cloud Run can hold one warm instance (--min-instances 1),
    which removes the cold start entirely. That is the whole reason to move:
    not cost, not scale, just never watching a judge stare at a spinner.

WHAT HAS TO BE TRUE FIRST
    Two APIs must be enabled on the project, and only an Owner can do it. The
    service account cannot enable them itself; --check will tell you plainly
    whether they are on yet.
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

REGION = "europe-west1"          # same region as the Neon database, Frankfurt-ish
SERVICE = "coaching-engine-api"
REPO = "coaching-engine"
GREEN, RED, YELLOW, DIM, RESET = (
    "\033[32m", "\033[31m", "\033[33m", "\033[2m", "\033[0m")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def credentials():
    from google.oauth2 import service_account
    import google.auth.transport.requests as gr

    files = glob.glob(os.path.join(ROOT, "project-*.json"))
    if not files:
        sys.exit(f"{RED}No service-account JSON in the repo root.{RESET}")
    project = json.load(open(files[0]))["project_id"]
    creds = service_account.Credentials.from_service_account_file(
        files[0], scopes=["https://www.googleapis.com/auth/cloud-platform"])
    creds.refresh(gr.Request())
    return files[0], project, creds


def api(creds, url, method="GET", body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={"Authorization": f"Bearer {creds.token}",
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, json.loads(r.read() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read() or "{}")
        except Exception:
            return e.code, {}


def env_pairs() -> list[dict]:
    """Everything the container needs, read from the .env used locally.

    Secrets never go in the image and never go in this file. They are sent once
    over TLS as part of the service definition, which is the same trust model
    as pasting them into the Render dashboard.
    """
    wanted = [
        "DATABASE_URL", "OPENAI_API_KEY", "OPENAI_API_KEY_FALLBACK",
        "GROQ_API_KEY", "ELEVENLABS_API_KEY", "MANUS_API_KEY",
        "GOOGLE_CREDENTIALS_JSON", "VERTEX_PROJECT_ID", "VERTEX_LOCATION",
        "LANGFUSE_PUBLIC_KEY", "LANGFUSE_SECRET_KEY", "LANGFUSE_HOST",
        "CE_ALLOWED_ORIGINS", "CE_DAILY_USD_LIMIT", "CE_VOICE_RESERVE",
        "CE_MAX_PRACTICE_TURNS", "CE_DEFAULT_ACTOR",
    ]
    found: dict[str, str] = {}
    path = os.path.join(ROOT, ".env")
    if os.path.isfile(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip('"').strip("'")
            if k in wanted and v:
                found[k] = v            # later wins, matching dotenv
    return [{"name": k, "value": v} for k, v in found.items()]


def check(creds, project) -> bool:
    print(f"\nProject {DIM}{project}{RESET}\n")
    ok = True
    for label, url in [
        ("Cloud Run API",
         f"https://run.googleapis.com/v2/projects/{project}/locations/{REGION}/services"),
        ("Artifact Registry API",
         f"https://artifactregistry.googleapis.com/v1/projects/{project}/locations/{REGION}/repositories"),
    ]:
        code, body = api(creds, url)
        if code == 200:
            print(f"  {GREEN}ready{RESET}    {label}")
        else:
            msg = body.get("error", {}).get("message", "")
            disabled = "has not been used" in msg or "is disabled" in msg
            print(f"  {RED}blocked{RESET}  {label}: "
                  f"{'API is not enabled on this project' if disabled else msg[:80]}")
            ok = False
    if not ok:
        print(f"""
{YELLOW}Someone with Owner on this project has to switch two APIs on.{RESET}
That is Mary-Susan. It is two clicks each and costs nothing:

  https://console.cloud.google.com/apis/library/run.googleapis.com?project={project}
  https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com?project={project}

Press ENABLE on both, then run this script again. The service account already
holds Cloud Run Admin, Artifact Registry Writer, Service Account User and
Storage Object Admin, so nothing else is needed.""")
    return ok


def run(cmd: list[str]) -> None:
    print(f"  {DIM}$ {' '.join(cmd[:6])}{'…' if len(cmd) > 6 else ''}{RESET}")
    subprocess.run(cmd, check=True, cwd=ROOT)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="report readiness and change nothing")
    ap.add_argument("--min-instances", default="1",
                    help="1 keeps an instance warm, which is the point of moving")
    args = ap.parse_args()

    key_file, project, creds = credentials()
    if not check(creds, project):
        return 1
    if args.check:
        print(f"\n{GREEN}Ready to deploy.{RESET} Re-run without --check.")
        return 0

    host = f"{REGION}-docker.pkg.dev"
    image = f"{host}/{project}/{REPO}/api:{int(time.time())}"

    # 1. a place to put the image
    code, _ = api(creds,
                  f"https://artifactregistry.googleapis.com/v1/projects/{project}"
                  f"/locations/{REGION}/repositories?repositoryId={REPO}",
                  "POST", {"format": "DOCKER",
                           "description": "The Coaching Engine API"})
    print(f"  repository: {'created' if code < 400 else 'already there'}")

    # 2. build and push. Docker authenticates as the service account using the
    #    key directly, which avoids needing gcloud just for a credential helper.
    print("\nBuilding…")
    run(["docker", "build", "-f", "services/api/Dockerfile", "-t", image, "."])
    print("\nPushing…")
    subprocess.run(["docker", "login", "-u", "_json_key", "--password-stdin", host],
                   input=open(key_file, "rb").read(), check=True, cwd=ROOT)
    run(["docker", "push", image])

    # 3. create or update the service
    body = {
        "template": {
            "containers": [{
                "image": image,
                "ports": [{"containerPort": 8000}],
                "env": env_pairs(),
                "resources": {"limits": {"cpu": "1", "memory": "1Gi"}},
            }],
            "scaling": {"minInstanceCount": int(args.min_instances),
                        "maxInstanceCount": 4},
            "timeout": "120s",
        },
    }
    base = f"https://run.googleapis.com/v2/projects/{project}/locations/{REGION}/services"
    code, res = api(creds, f"{base}?serviceId={SERVICE}", "POST", body)
    if code == 409:
        print("\nService exists, updating…")
        code, res = api(creds, f"{base}/{SERVICE}", "PATCH", body)
    if code >= 400:
        print(f"{RED}Deploy failed: {json.dumps(res)[:400]}{RESET}")
        return 1

    # 4. let the public reach it, same as Render does
    api(creds, f"{base}/{SERVICE}:setIamPolicy", "POST",
        {"policy": {"bindings": [{"role": "roles/run.invoker",
                                  "members": ["allUsers"]}]}})

    print("\nWaiting for the revision…")
    url = ""
    for _ in range(40):
        time.sleep(6)
        code, svc = api(creds, f"{base}/{SERVICE}")
        url = svc.get("uri", "")
        conds = {c.get("type"): c.get("state") for c in svc.get("conditions", [])}
        if conds.get("Ready") == "CONDITION_SUCCEEDED" and url:
            break
        if conds.get("Ready") == "CONDITION_FAILED":
            print(f"{RED}Revision failed: {svc.get('conditions')}{RESET}")
            return 1

    print(f"\n{GREEN}Deployed{RESET}  {url}")
    print(f"""
Before you point anything at it:

  curl {url}/health

It must report database up and every provider true. Only then change
NEXT_PUBLIC_API_BASE_URL in Vercel to {url}/api/v1 and redeploy the front end.
Leave Render running until you have done that, so there is always one API that
works.""")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
