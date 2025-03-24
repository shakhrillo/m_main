import csv
from datetime import datetime
from selenium import webdriver
print(selenium.__version__)
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.exceptions import NoSuchElementException, ElementNotInteractableException
from webdriver_manager.chrome import ChromeDriverManager


def get_url(position, location):
    """Generate URL from position and location."""
    template = 'https://www.indeed.com/jobs?q={}&l={}'
    position = position.replace(' ', '+')
    location = location.replace(' ', '+')
    return template.format(position, location)

def get_record(card):
    """Extract job data from a single card."""
    try:
        job_title = card.find_element(By.CLASS_NAME, 'jobTitle').text
    except NoSuchElementException:
        job_title = "N/A"
    
    try:
        company = card.find_element(By.CLASS_NAME, 'companyName').text
    except NoSuchElementException:
        company = "N/A"
    
    try:
        location = card.find_element(By.CLASS_NAME, 'companyLocation').text
    except NoSuchElementException:
        location = "N/A"
    
    try:
        post_date = card.find_element(By.CLASS_NAME, 'date').text
    except NoSuchElementException:
        post_date = "N/A"
    
    extract_date = datetime.today().strftime('%Y-%m-%d')
    
    try:
        summary = card.find_element(By.CLASS_NAME, 'job-snippet').text
    except NoSuchElementException:
        summary = "N/A"
    
    try:
        job_url = card.find_element(By.CLASS_NAME, 'jobTitle a').get_attribute('href')
    except NoSuchElementException:
        job_url = "N/A"
    
    return job_title, company, location, post_date, extract_date, summary, job_url

def get_page_records(cards, job_list, url_set):
    """Extract all job listings from the page."""
    for card in cards:
        record = get_record(card)
        if record[0] and record[-1] not in url_set:
            job_list.append(record)
            url_set.add(record[-1])

def save_data_to_file(records):
    """Save job data to CSV file."""
    with open('results.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['JobTitle', 'Company', 'Location', 'PostDate', 'ExtractDate', 'Summary', 'JobUrl'])
        writer.writerows(records)

def main(position, location):
    """Main function to execute job scraping."""
    scraped_jobs = []
    scraped_urls = set()
    url = get_url(position, location)
    
    options = Options()
    # options.add_argument('--headless')  # Run in headless mode
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(5)
    driver.get(url)
    
    while True:
        cards = driver.find_elements(By.CLASS_NAME, 'result')
        get_page_records(cards, scraped_jobs, scraped_urls)
        try:
            next_button = driver.find_element(By.XPATH, '//a[@aria-label="Next"]')
            next_button.click()
        except (NoSuchElementException, ElementNotInteractableException):
            break
    
    driver.quit()
    save_data_to_file(scraped_jobs)

if __name__ == '__main__':
    main('python developer', 'charlotte nc')