import asyncio
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

    if url is None:
        errorMsg = "Please provide a valid URL"
        return errorMsg

    driver.get(url)
    time.sleep(2)

    result_links = []

    all_a_elements = driver.find_elements(By.XPATH, "//a")

    for a in all_a_elements:
        attr = a.get_attribute('jsaction')
        if attr is not None and 'clickmod:pane' in attr:
            url = a.get_attribute('href')
            if url is not None and 'maps' in url:
                url = change_language_in_url(url, 'en')

                review_link = await google_map_review_link(driver, url)
                result_links.append(review_link)

    results = await google_map_reviews_data(driver, result_links)

    driver.quit()

    return results