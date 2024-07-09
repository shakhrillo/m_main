import asyncio
from selenium_scrap.helper.change_language_in_url import change_language_in_url
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

async def google_map_review_link(driver, url):

    if url is None:
        errorMsg = "Please provide a valid URL"
        return errorMsg

    # open new tab
    driver.execute_script("window.open('');")
    driver.switch_to.window(driver.window_handles[1])
    driver.get(url)

    # driver.get(url)
    time.sleep(2)

    all_button_elements = driver.find_elements(By.XPATH, "//button")

    review_tab = None

    time.sleep(2)
    for button in all_button_elements:
        attr = button.get_attribute('data-tab-index')
        if attr is not None and '1' in attr:
            review_tab = button

    time.sleep(2)

    if review_tab is not None:
        driver.execute_script("arguments[0].click();", review_tab)
        time.sleep(2)

    # get url in the link
    current_url = driver.current_url

    driver.close()
    driver.switch_to.window(driver.window_handles[0])

    await asyncio.sleep(2)

    return current_url