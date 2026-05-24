
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

BASE_URL = os.environ.get("BASE_URL", "https://sauce-demo.myshopify.com")
AUTH_URL = os.environ.get("AUTH_URL", BASE_URL)
AUTH_ACCOUNT_FLOW = os.environ.get("AUTH_ACCOUNT_FLOW", "auto").lower()
STORAGE_PATH = Path(os.environ.get("PLAYWRIGHT_STORAGE_STATE", "playwright/.auth/shopify.json"))
PROFILE_PATH = Path(os.environ.get("CAMOUFOX_PROFILE", "playwright/.camoufox-profile"))
CF_COOKIE_NAMES = {"cf_clearance", "_cfuvid", "__cf_bm"}
CF_TITLE_MARKERS = ("Just a moment", "Attention Required!", "Please wait")
SUPPRESS_PAGE_ERRORS_SCRIPT = """
(() => {
  window.onerror = () => true;
  window.addEventListener('error', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  window.addEventListener('unhandledrejection', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
})();
"""


def env_flag(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def is_cloudflare_challenge(title: str, url: str) -> bool:
    return any(marker in title for marker in CF_TITLE_MARKERS) or "cdn-cgi/challenge" in url


def is_connection_verification(page) -> bool:
    try:
        return page.get_by_role(
            "heading", name=re.compile(r"connection needs to be verified", re.I)
        ).is_visible()
    except Exception:
        return False


def is_challenge_page(page) -> bool:
    return is_cloudflare_challenge(page.title(), page.url) or is_connection_verification(page)


def find_cf_clearance(cookies: list[dict]) -> dict | None:
    return next((cookie for cookie in cookies if cookie.get("name") == "cf_clearance"), None)


def locator_is_visible(locator) -> bool:
    try:
        return locator.is_visible()
    except Exception:
        return False


def hcaptcha_is_visible(page) -> bool:
    return locator_is_visible(page.get_by_text("Protected by hCaptcha").first)


def account_page_is_visible(page) -> bool:
    if re.search(r"/account/?$", page.url):
        return True
    return locator_is_visible(
        page.get_by_role("heading", name=re.compile(r"My Account|Account Details", re.I))
    )


def prepare_login_flow(page) -> bool:
    email = os.environ.get("SHOPIFY_TEST_EMAIL")
    password = os.environ.get("SHOPIFY_TEST_PASSWORD")

    if not email or not password:
        print("[auth-camoufox] SHOPIFY_TEST_EMAIL/SHOPIFY_TEST_PASSWORD not found; login autofill skipped.")
        return False

    print("[auth-camoufox] Opening login via storefront navigation and filling credentials...")
    page.goto("/", wait_until="domcontentloaded", timeout=30_000)

    try:
        page.get_by_role("banner").get_by_role("link", name=re.compile(r"Log In", re.I)).click(
            timeout=15_000
        )
    except Exception:
        page.goto("/account/login", wait_until="domcontentloaded", timeout=30_000)

    page.get_by_label("Email Address").fill(email, timeout=15_000)
    page.get_by_label("Password").fill(password, timeout=15_000)
    return True


def prepare_register_flow(page) -> bool:
    email = os.environ.get("SHOPIFY_REGISTER_EMAIL") or os.environ.get("SHOPIFY_TEST_EMAIL")
    password = os.environ.get("SHOPIFY_REGISTER_PASSWORD") or os.environ.get("SHOPIFY_TEST_PASSWORD")
    first_name = os.environ.get("SHOPIFY_REGISTER_FIRST_NAME", "Test")
    last_name = os.environ.get("SHOPIFY_REGISTER_LAST_NAME", "User")

    if not email or not password:
        print("[auth-camoufox] Register credentials not found; register autofill skipped.")
        return False

    print("[auth-camoufox] Opening register page and filling available fields...")
    page.goto("/", wait_until="domcontentloaded", timeout=30_000)

    try:
        page.get_by_role("link", name=re.compile(r"Sign up|Sign Up", re.I)).click(timeout=15_000)
    except Exception:
        page.goto("/account/register", wait_until="domcontentloaded", timeout=30_000)

    for label, value in (
        (re.compile(r"First Name|First name", re.I), first_name),
        (re.compile(r"Last Name|Last name", re.I), last_name),
        (re.compile(r"Email", re.I), email),
        (re.compile(r"Password", re.I), password),
    ):
        field = page.get_by_label(label).first
        if locator_is_visible(field):
            field.fill(value, timeout=15_000)

    return True


def prepare_account_flow(page) -> None:
    flow = AUTH_ACCOUNT_FLOW
    if flow == "auto":
        flow = "login" if os.environ.get("SHOPIFY_TEST_EMAIL") else "manual"

    if flow in {"0", "none", "skip"}:
        return

    if flow == "login":
        if prepare_login_flow(page):
            print("[auth-camoufox] Login credentials filled.")
        return

    if flow == "register":
        if prepare_register_flow(page):
            print("[auth-camoufox] Register fields filled.")
        return

    print("[auth-camoufox] Manual account flow. Navigate/login/register in the browser as needed.")


def save_state(context, cf_cookie: dict | None) -> None:
    state = context.storage_state()
    STORAGE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[auth-camoufox] Session saved to {STORAGE_PATH}")
    if cf_cookie:
        expires = datetime.fromtimestamp(cf_cookie["expires"]).strftime("%d/%m/%Y %H:%M")
        print(f"[auth-camoufox] cf_clearance expires: {expires}\n")
    else:
        print("[auth-camoufox] No cf_clearance cookie was issued; storefront is accessible without a challenge.\n")
    print("[auth-camoufox] Persistent browser profile was kept as well.")


def main() -> None:
    try:
        from camoufox.sync_api import Camoufox
    except ImportError:
        print("[auth-camoufox] Camoufox is not installed.")
        print("[auth-camoufox] Run: pip install camoufox")
        print("[auth-camoufox]      python -m camoufox fetch")
        sys.exit(1)

    STORAGE_PATH.parent.mkdir(parents=True, exist_ok=True)
    PROFILE_PATH.mkdir(parents=True, exist_ok=True)
    print("[auth-camoufox] Opening Camoufox...")

    state_saved = False

    try:
        with Camoufox(
            headless=False,
            humanize=True,
            disable_coop=True,
            main_world_eval=True,
            persistent_context=True,
            user_data_dir=str(PROFILE_PATH),
            base_url=BASE_URL,
            viewport={"width": 1366, "height": 768},
            locale="en-US",
            window=(1366, 768),
            os="windows",
        ) as context:
            context.add_init_script(SUPPRESS_PAGE_ERRORS_SCRIPT)
            page = context.pages[0] if context.pages else context.new_page()
            page.on("pageerror", lambda _: None)

            page.goto(AUTH_URL, wait_until="domcontentloaded", timeout=30_000)
            if not is_challenge_page(page):
                prepare_account_flow(page)

            print()
            print("[auth-camoufox] If Cloudflare appears, complete the verification.")
            print("[auth-camoufox] If hCaptcha appears on login/register, solve it and submit manually.")
            print("[auth-camoufox] Wait until the account/result page is stable, then return here.")
            print(f"[auth-camoufox] Persistent profile: {PROFILE_PATH}")
            print()

            while True:
                input("[auth-camoufox] Press ENTER to inspect and save the current session... ")

                try:
                    cookies = context.cookies()
                except Exception as cookie_error:
                    print(f"\n[auth-camoufox] Browser driver crashed: {cookie_error}")
                    print("[auth-camoufox] Try updating Playwright/Camoufox, then run this command again.")
                    os._exit(1)

                cf_cookie = find_cf_clearance(cookies)
                challenge_visible = is_challenge_page(page)

                if challenge_visible:
                    print("[auth-camoufox] Cloudflare challenge is still visible.")
                    print("[auth-camoufox] Complete the verification in the browser, wait for the real site, then press ENTER again.\n")
                    continue

                if hcaptcha_is_visible(page) and not account_page_is_visible(page):
                    print("[auth-camoufox] hCaptcha is still visible on the account form.")
                    print("[auth-camoufox] Solve hCaptcha, submit the form, wait for the result page, then press ENTER again.\n")
                    continue

                if cf_cookie or not challenge_visible:
                    save_state(context, cf_cookie)
                    state_saved = True
                    break

    except Exception as error:
        message = str(error)
        if state_saved and ("Connection closed" in message or "Browser.close" in message):
            return
        raise


if __name__ == "__main__":
    main()
