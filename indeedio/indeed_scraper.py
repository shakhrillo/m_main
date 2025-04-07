import pytest
from playwright.async_api import async_playwright

@pytest.mark.asyncio
async def test_indeed_job_scraper():
    AUTH = 'brd-customer-hl_27040de8-zone-scraping_browser1:dk1j5j2jbo4l'
    SBR_WS_CDP = f'wss://{AUTH}@brd.superproxy.io:9222'
    
    print('Connecting to Scraping Browser...')
    
    async with async_playwright() as pw:
        try:
            browser = await pw.chromium.connect_over_cdp(SBR_WS_CDP)
            print('Connected to browser.')

            page = await browser.new_page()
            await page.set_viewport_size({"width": 1280, "height": 800})

            await page.goto('https://www.indeed.com/jobs?q=software%20developer&l=New%20York')

            await page.wait_for_load_state('networkidle')
            print('Page fully loaded.')

            await page.wait_for_selector("body", timeout=15000)

            await page.wait_for_selector("div.job_seen_beacon", timeout=15000)
            print("Job listings found!")

            await page.screenshot(path="page.png", full_page=True)
            print("Screenshot saved as 'page.png'")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            await browser.close()
            print('Browser closed.')
