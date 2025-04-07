import pytest
from playwright.async_api import async_playwright
import json

@pytest.mark.asyncio
async def test_indeed_job_scraper():
    AUTH = 'brd-customer-hl_27040de8-zone-scraping_browser1:dk1j5j2jbo4l'
    SBR_WS_CDP = f'wss://{AUTH}@brd.superproxy.io:9222'
    
    print('Connecting to Scraping Browser...')
    job_data = []
    page_number = 0
    max_jobs = 15
    
    async with async_playwright() as pw:
        try:
            browser = await pw.chromium.connect_over_cdp(SBR_WS_CDP)
            print('Connected to browser.')

            page = await browser.new_page()
            await page.set_viewport_size({"width": 1280, "height": 800})

            while len(job_data) < max_jobs:
                page_number += 1
                url = f"https://www.indeed.com/jobs?q=software%20developer&l=New%20York&page={page_number}"
                print(f"Scraping page {page_number}...")
                await page.goto(url)
                
                await page.wait_for_load_state('networkidle')
                print('Page fully loaded.')

                await page.wait_for_selector("body", timeout=15000)

                await page.wait_for_selector("div.job_seen_beacon", timeout=15000)
                print("Job listings found!")

                job_listing = await page.query_selector_all("div.job_seen_beacon")

                for i, job in enumerate(job_listing):
                    title = await job.inner_text()

                    print(f"Job {i+1}: {title}")

                    job_data.append({"job_title": title})

                    if len(job_data) >= max_jobs:
                        break
                
                if len(job_data) >= max_jobs:
                    break

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            with open('job_data.json', 'w', encoding='utf-8') as f:
                json.dump(job_data, f, ensure_ascii=False, indent=4)
            
            print('Job data exported to job_data.json')

            await browser.close()
            print('Browser closed.')
