from playwright.sync_api import sync_playwright

def test_frontend_rendering():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local development server play.html
        page.goto("http://localhost:3000/play.html")

        # Verify the custom UI is present
        page.wait_for_selector("#desktopUI")

        # Take a screenshot to prove the 2D Desktop UI overlay is visible
        page.screenshot(path="/home/jules/verification.png")

        browser.close()

if __name__ == "__main__":
    test_frontend_rendering()
