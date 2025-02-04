from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
from selenium_scrap.map_time import ago_to_time

async def google_map_reviews(driver, url):
    driver.execute_script("window.open('');")
    driver.switch_to.window(driver.window_handles[1])
    
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
    except Exception as e:
        print(e)
        driver.quit()
        return []

    vyucnb = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[@class='vyucnb']")))

    if vyucnb is None:
        driver.close()
        driver.switch_to.window(driver.window_handles[0])

        return []

    parentElmOfvyucnb = vyucnb.find_element(By.XPATH, "..")
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

    all_buttons = driver.find_elements(By.XPATH, "//button")

    count = 0
    if len(all_buttons) != 0:
        for button in all_buttons:
            attr = button.get_attribute('jsaction')
            if attr is not None and 'expandReview' in attr:
                count += 1
                driver.execute_script("arguments[0].click();", button)
                time.sleep(1)
            
            if attr is not None and 'showReviewInOriginal' in attr:
                count += 1
                driver.execute_script("arguments[0].click();", button)
                time.sleep(1)

    reviews = []
    all_data_review_id = driver.find_elements(By.XPATH, "//div[@data-review-id]")
    
    for element in all_data_review_id:
        review = {
            'user_name': '',
            'user_info': '',
            'content': '',
            'date': ''
        }

        araiaLabel = element.get_attribute('aria-label')
        elementFirstChildren = element.find_elements(By.XPATH, "./*")
        elementFirstChildrenAttr = elementFirstChildren[0].get_attribute('jsaction')
        if araiaLabel is None or elementFirstChildrenAttr is None:
            continue


        buttons = element.find_elements(By.TAG_NAME, "button")
        for button in buttons:
            button_attr = button.get_attribute('jsaction')
            button_href = button.get_attribute('data-href')
            if button_attr is not None and 'review.reviewerLink' in button_attr and button_href is not None and 'reviews' in button_href:
                all_divs = button.find_elements(By.TAG_NAME, "div")
                if len(all_divs) != 2:
                    continue
                review['user_name'] = all_divs[0].text
                review['user_info'] = all_divs[1].text

        review_myened = element.find_elements(By.CLASS_NAME, "MyEned")
        if len(review_myened) > 0:
            review_myened_text = review_myened[0].text
            review_myened_text = review_myened_text.replace('\n', ' ')
            review_myened_text = review_myened_text.replace('  ', ' ')
            review_myened_text = review_myened_text.strip()
            review['content'] = f'{review_myened_text}'

        span = element.find_elements(By.TAG_NAME, "span")
        for s in span:
            span_value = s.text
            if span_value is not None and 'ago' in span_value:
                review['date'] = span_value
                # review['date'] = ago_to_time(span_value)

        reviews.append(review)

    time.sleep(1)

    driver.close()
    driver.switch_to.window(driver.window_handles[0])
    # await asyncio.sleep(2)

    return reviews