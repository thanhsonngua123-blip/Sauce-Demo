from pathlib import Path
import os

from camoufox.sync_api import Camoufox


URL = os.environ.get("AUTH_URL", "https://sauce-demo.myshopify.com/")
STORAGE_STATE = Path(os.environ.get("PLAYWRIGHT_STORAGE_STATE", "playwright/.auth/shopify.json"))
VIEWPORT_WIDTH = int(os.environ.get("CAMOUFOX_VIEWPORT_WIDTH", "1366"))
VIEWPORT_HEIGHT = int(os.environ.get("CAMOUFOX_VIEWPORT_HEIGHT", "768"))
PAGE_ZOOM = float(os.environ.get("CAMOUFOX_PAGE_ZOOM", "0.85"))


def main():
    STORAGE_STATE.parent.mkdir(parents=True, exist_ok=True)

    with Camoufox(headless=False, humanize=True) as browser:
        page = browser.new_page(
            viewport={"width": VIEWPORT_WIDTH, "height": VIEWPORT_HEIGHT},
            locale="en-US",
        )
        page.add_init_script(
            f"""
            window.addEventListener('DOMContentLoaded', () => {{
              document.documentElement.style.zoom = '{PAGE_ZOOM}';
            }});
            """
        )
        page.goto(URL, wait_until="domcontentloaded")

        print("Camoufox opened.")
        print("If Cloudflare appears, complete verification manually in the browser.")
        input("When the real site is loaded, press Enter here to inspect and save storage state...")

        print(f"URL: {page.url}")
        print(f"Title: {page.title()}")

        page.context.storage_state(path=str(STORAGE_STATE))
        print(f"Saved storage state to {STORAGE_STATE}")


if __name__ == "__main__":
    main()
