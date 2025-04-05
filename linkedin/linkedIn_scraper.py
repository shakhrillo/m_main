from seleniumbase import BaseCase
import json
import logging
from time import sleep
from random import randint
from bs4 import BeautifulSoup
from selenium.common.exceptions import NoAlertPresentException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LinkedInJobScraper(BaseCase):
    def get_url(self, position, location):
        template = 'https://www.linkedin.com/jobs/search/?keywords={}&location={}&start=0'
        return template.format(position, location)

    def dismiss_modal(self):
        try:
            close_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '.modal__dismiss'))
            )
            close_button.click()
            logging.info("Modal closed successfully.")
        except TimeoutException:
            logging.info("No modal found or modal not clickable.")

    def click_see_more_jobs(self):
        try:
            see_more_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="See more jobs"]'))
            )
            see_more_button.click()
            logging.info("Clicked 'See more jobs' button.")
            self.sleep(2)
        except TimeoutException:
            logging.info("'See more jobs' button not found or not clickable.")

    def scrape_jobs(self, max_jobs=350):
        records = []
        while len(records) < max_jobs:
            job_cards = self.find_elements('ul.jobs-search__results-list li')
            logging.info(f"Found {len(job_cards)} job cards on the page.")

            for card in job_cards:
                try:
                    html = card.get_attribute('outerHTML')
                    if not html:
                        logging.warning("Card outerHTML is None, skipping this card.")
                        continue

                    soup = BeautifulSoup(html, 'html.parser')

                    job_title = soup.find('h3', class_='base-search-card__title')
                    company_name = soup.find('h4', class_='base-search-card__subtitle')
                    location = soup.find('span', class_='job-search-card__location')
                    job_link = soup.find('a', class_='base-card__full-link')
                    job_link_url = job_link['href'] if job_link else 'N/A'

                    record_data = {
                        "job_title": job_title.get_text(strip=True) if job_title else "N/A",
                        "company_name": company_name.get_text(strip=True) if company_name else "N/A",
                        "location": location.get_text(strip=True) if location else "N/A",
                        "job_link": job_link_url
                    }

                    records.append(record_data)

                    if len(records) >= max_jobs:
                        break

                except Exception as e:
                    logging.warning(f"Skipping a card due to error: {e}")
                    continue
            self.click_see_more_jobs()
        return records

    def test_scrape_jobs(self, position='software engineer', location='new york'):
        url = self.get_url(position, location)
        self.open(url)
        self.sleep(3)
        self.dismiss_modal()
        records = self.scrape_jobs(max_jobs=350)
        print(f"length: {len(records)}")
        with open("linkedin_jobs.json", "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=4)
