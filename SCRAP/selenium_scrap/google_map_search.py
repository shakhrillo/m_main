import asyncio
from selenium_scrap.helper.get_filtered_elements import get_filtered_elements
from selenium_scrap.google_map_reviews_data import google_map_reviews_data
from selenium_scrap.google_map_review_link import google_map_review_link
from selenium_scrap.helper.change_language_in_url import change_language_in_url
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

options = webdriver.ChromeOptions()
# options.add_argument("--headless")
options.add_argument("--lang=en")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(
    service=service,
    options=options
)

async def google_map_search(text):

    url = f"https://www.google.com/maps/search/border+crossing+station+{text.replace(' ', '+')}"

    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
    except Exception as e:
        print(e)
        driver.quit()
        return []

    all_a_elements = get_filtered_elements(driver, By.XPATH, "//a", 'jsaction', 'clickmod:pane')
    extracted_urls = [url.get_attribute('href') for url in all_a_elements]
    translated_urls = [change_language_in_url(url, 'en') for url in extracted_urls]
    review_urls = [await google_map_review_link(driver, url) for url in translated_urls]
    review_urls = [url for url in review_urls if url != '']

    print('Review URLs:')
    print(review_urls)
    print('-' * 50)

    # results = await google_map_reviews_data(driver, result_links)

    results = []

    print('results done')

    driver.quit()

    return results