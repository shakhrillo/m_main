from seleniumbase import BaseCase
from selenium.webdriver.chrome.options import Options
import csv
import json
from time import sleep
from random import randint
from datetime import datetime
import logging
from bs4 import BeautifulSoup

class IndeedJobScraper(BaseCase):

    def get_url(self, position, location, page_number=0):
        template = 'https://www.indeed.com/jobs?q={}&l={}&start={}'
        return template.format(position, location, page_number * 10)

    def setUp(self):
        # Setting up headless options for Chrome WebDriver
        options = Options()
        options.add_argument("--headless")  # Ensures Chrome is running in headless mode
        options.add_argument("--disable-gpu")  # Disables GPU hardware acceleration
        options.add_argument("--window-size=1920x1080")  # Simulates a full-size window
        self.driver = self.get_new_driver(options=options)  # Use headless Chrome

    def test_scrape_jobs(self, position='software developer', location='new york'):
        url = self.get_url(position, location,)
        self.activate_cdp_mode(url)
        
        self.uc_gui_click_captcha()
        
        self.open(url)
        self.sleep(3)

        records = []
        max_jobs = 20
        page = 1

        while len(records) < max_jobs:
            job_cards = self.find_elements('div.job_seen_beacon', 'css selector', 30)
            logging.info(job_cards)

            for card in job_cards:
                try:
                    html = card.get_attribute('outerHTML')
                    if not html:
                        print("not html")
                        logging.warning("Card outerHTML is None, skipping this card.")

                    soup = BeautifulSoup(html, 'html.parser')
                    job_title = soup.find('span', {'id': lambda x: x and x.startswith('jobTitle-')})
                    company_name = soup.find('span', {'data-testid': 'company-name'})
                    location = soup.find('div', {'data-testid': 'text-location'})
                    job_link = soup.find('a', {'id': lambda x: x and x.startswith('job_')})
                    
                    record_data = {
                        "job_title": job_title.get_text(strip=True) if job_title else "N/A",
                        "company_name": company_name.get_text(strip=True) if company_name else "N/A",
                        "location": location.get_text(strip=True) if location else "N/A",
                        "job_link": job_link.get("href") if job_link and job_link.get("href") else "N/A"
                    }

                    records.append(record_data)
                    if len(records) >= max_jobs:
                        break
                except Exception as e:
                    logging.warning(f"Skipping a card due to error: {e}")
                    continue
            page += 1
            try:
                next_button_selector = f'a[aria-label="{page}"]'
                if self.is_element_visible(next_button_selector):
                    print(f"Navigating to page {page}...")
                    current_url = self.get_current_url()

                    self.click(next_button_selector)
                    self.wait_for_element('div.job_seen_beacon', timeout=10)
                    self.wait_for_ready_state_complete()
                    self.sleep(randint(2, 4))

                    new_url = self.get_current_url()
                    if current_url == new_url:
                        print("The page did not change after clicking the next page button.")
                        break
                else:
                    print(f"Page {page} button not found or not visible.")
                    break
            except Exception as e:
                print(f"Error navigating to page {page}: {e}")
                break

        with open("jobs.json", "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=4)
