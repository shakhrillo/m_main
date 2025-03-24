from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import csv
from time import sleep
from random import randint
from datetime import datetime

def get_url(position, location):
    template = 'https://www.indeed.com/jobs?q={}&l={}'
    return template.format(position, location)

def get_record(card):
    try:
        job_title = card.find_element(By.CSS_SELECTOR, 'h2 a').text
    except:
        job_title = ''
    
    try:
        company = card.find_element(By.CSS_SELECTOR, 'span.company').text.strip()
    except:
        company = ''
    
    try:
        location = card.find_element(By.CSS_SELECTOR, 'div.recJobLoc').get_attribute('data-rc-loc')
    except:
        location = ''
    
    try:
        job_summary = card.find_element(By.CSS_SELECTOR, 'div.summary').text.strip()
    except:
        job_summary = ''
    
    try:
        post_date = card.find_element(By.CSS_SELECTOR, 'span.date').text.strip()
    except:
        post_date = ''
    
    try:
        salary = card.find_element(By.CSS_SELECTOR, 'span.salaryText').text.strip()
    except:
        salary = ''
    
    try:
        job_url = card.find_element(By.CSS_SELECTOR, 'h2 a').get_attribute('href')
    except:
        job_url = ''
    
    extract_date = datetime.today().strftime('%Y-%m-%d')
    
    return (job_title, company, location, job_summary, salary, post_date, extract_date, job_url)

def main(position, location):
    options = Options()
    # options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    url = get_url(position, location)
    driver.get(url)
    sleep(3)
    records = []
    
    while True:
        job_cards = driver.find_elements(By.CSS_SELECTOR, 'div.job_seen_beacon')
        for card in job_cards:
            record = get_record(card)
            records.append(record)
        
        try:
            next_button = driver.find_element(By.CSS_SELECTOR, 'a[aria-label="Next"]')
            next_button.click()
            sleep(randint(2, 5))
        except:
            break
    
    driver.quit()
    
    with open('results.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Job Title', 'Company', 'Location', 'Salary', 'Posting Date', 'Extract Date', 'Summary', 'Job Url'])
        writer.writerows(records)
    
if __name__ == '__main__':
    main('software developer', 'new york')
