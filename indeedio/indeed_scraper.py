from seleniumbase import BaseCase
import csv
from time import sleep
from random import randint
from datetime import datetime
import logging
from bs4 import BeautifulSoup

class IndeedJobScraper(BaseCase):
    def get_url(self, position, location):
        template = 'https://www.indeed.com/jobs?q={}&l={}'
        return template.format(position, location)

    def test_scrape_jobs(self, position='software developer', location='new york'):
        url = self.get_url(position, location)
        self.activate_cdp_mode(url)
        
        # Optional: Handle CAPTCHA
        self.uc_gui_click_captcha()
        
        self.open(url)
        self.sleep(3)

        records = []

        while True:
            job_cards = self.find_elements('div.job_seen_beacon')
            # node elements = job_cards.find_elements('div.job_seen_beacon')
            logging.info(job_cards)

            for card in job_cards:
                html = card.get_attribute('outerHTML')
                if not html:
                    print("not html")
                    logging.warning("Card outerHTML is None, skipping this card.")
                    continue  # Skip this card if outerHTML is None

                soup = BeautifulSoup(html, 'html.parser')
                
                # Get job title
                job_title = soup.find('span', {'id': lambda x: x and x.startswith('jobTitle-')})

                print(f"Title: {job_title.text}")
                # Get company name
                company_name = soup.find('span', {'data-testid': 'company-name'})

                # Get location
                location = soup.find('div', {'data-testid': 'text-location'})

                # Optional: Get job link
                job_link = soup.find('a', {'id': lambda x: x and x.startswith('job_')})
                
                record = (
                    job_title.get_text() if job_title else "N/A",
                    company_name.get_text() if company_name else "N/A",
                    location.get_text() if location else "N/A",
                    job_link['href'] if job_link else "N/A"
                )
                
                records.append(record)

            # break
            try:
                self.click('a[aria-label="Next"]')
                self.sleep(randint(2, 5))
            except Exception:
                break
        
        # Save as txt file
        with open('results.txt', 'w', encoding='utf-8') as f:
            for record in records:
                f.write("".join(record) + '\n')
