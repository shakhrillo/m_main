import asyncio
from selenium_scrap.helper.get_filtered_elements import get_filtered_elements
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

async def google_map_review_link(driver, url):

    if url is None or url == '' or 'maps' not in url:
        print('Invalid URL')
        return ''

    driver.execute_script("window.open('');")
    driver.switch_to.window(driver.window_handles[1])

    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )
    except Exception as e:
        driver.close()
        driver.switch_to.window(driver.window_handles[0])
        return ''

    all_button_elements = get_filtered_elements(driver, By.XPATH, "//button", 'data-tab-index', '1')

    review_tab = all_button_elements[0] if len(all_button_elements) > 0 else None

    if review_tab is not None:
        driver.execute_script("arguments[0].click();", review_tab)
        await asyncio.sleep(4)
        current_url = driver.current_url
    else:
        current_url = ''

    driver.close()
    driver.switch_to.window(driver.window_handles[0])

    return current_url