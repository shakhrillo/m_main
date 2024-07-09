import asyncio
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

# options = webdriver.ChromeOptions()
# options.add_argument("--headless")
# options.add_argument("--lang=en")

# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(
#     service=service,
#     options=options
# )

async def google_map_reviews(driver, url):

    if url is None:
        errorMsg = "Please provide a valid URL"
        return errorMsg

    # open new tab
    driver.execute_script("window.open('');")
    driver.switch_to.window(driver.window_handles[1])
    driver.get(url)
    time.sleep(2)

    vyucnb = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[@class='vyucnb']")))

    parentElmOfvyucnb = vyucnb.find_element(By.XPATH, "..")
    # scroll height
    scrollHeight = parentElmOfvyucnb.get_attribute("scrollHeight")
    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
    time.sleep(2)

    while True:
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
        time.sleep(2)
        newScrollHeight = parentElmOfvyucnb.get_attribute("scrollHeight")

        if newScrollHeight == scrollHeight:
            break
        scrollHeight = newScrollHeight

    MyEned = driver.find_elements(By.CLASS_NAME, "MyEned")

    all_buttons = driver.find_elements(By.XPATH, "//button")

    count = 0
    if len(all_buttons) != 0:
        for button in all_buttons:
            attr = button.get_attribute('jsaction')
            if attr is not None and 'expandReview' in attr:
                count += 1
                driver.execute_script("arguments[0].click();", button)
                time.sleep(2)
            
            if attr is not None and 'showReviewInOriginal' in attr:
                count += 1
                driver.execute_script("arguments[0].click();", button)
                time.sleep(2)

    messages = []

    for i in MyEned:
        messages.append(i.text)

    # time.sleep(2)

    # driver.quit()
    driver.close()
    driver.switch_to.window(driver.window_handles[0])
    await asyncio.sleep(2)

    return messages