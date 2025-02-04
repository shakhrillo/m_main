import asyncio
import os
import time
import requests
from selenium.webdriver.common.by import By
# from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager

# options = webdriver.ChromeOptions()
# options.add_argument("--window-size=1920,1080")
# options.add_argument("--start-maximized")
# options.add_argument("--headless")
# options.add_argument("--lang=en")

# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(
#   service=service,
#   options=options
# )

async def open_website(url, driver):

  # url = f"https://www.google.com/maps/search/border+crossing+station+{text.replace(' ', '+')}"

  try:
    # driver.execute_script("window.open('');")
    # driver.switch_to.window(driver.window_handles[1])

    driver.get(url)
    WebDriverWait(driver, 10).until(
      lambda d: d.execute_script('return document.readyState') == 'complete'
    )

    time.sleep(5)

    allButtons = driver.find_elements(By.XPATH, "//button[@role='tab']")
    print(len(allButtons))
    for button in allButtons:
      dataTabIndex = button.get_attribute('data-tab-index')
      if dataTabIndex is not None and dataTabIndex == '1':
        print('clicking')
        button.click()
        time.sleep(2)
        break
    
    allDivs = driver.find_elements(By.XPATH, "//div[@tabindex='-1']")
    parentElm = None
    for div in allDivs:
      jslog = div.get_attribute('jslog')
      if jslog is not None and 'mutable:true' in jslog:
        parentElm = div
        break

    if parentElm is None:
      return

    scrollHeight = parentElm.get_attribute("scrollHeight")
    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm)
    time.sleep(2)

    while True:
      driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm)
      time.sleep(2)
      newScrollHeight = parentElm.get_attribute("scrollHeight")
      if newScrollHeight == scrollHeight:
        break
      scrollHeight = newScrollHeight

    # button with jsaction contains openPhoto
    allButtons = driver.find_elements(By.XPATH, "//button")
    for button in allButtons:
      jsaction = button.get_attribute('jsaction')
      if jsaction is not None and 'review.showMorePhotos' in jsaction:
        button.click()
        time.sleep(2)
        break

    # find all div with the data-review-id attribute
    allDataReviewId = driver.find_elements(By.XPATH, "//div[@data-review-id]")
    # filter if the children contains only one dive with the data-review-id attribute
    allDataReviewId = [element for element in allDataReviewId if len(element.find_elements(By.XPATH, ".//div[@data-review-id]")) == 1]

    if not os.path.exists('./images'):
      os.makedirs('./images')

    messages = []

    for element in allDataReviewId:
      extractedImageUrls = []
      savedImages = []
      for button in element.find_elements(By.XPATH, ".//button"):
        jsaction = button.get_attribute('jsaction')
        if jsaction is not None and 'review.openPhoto' in jsaction:
          imageUrl = button.get_attribute('style').split('url("')[1].split('");')[0]
          extractedImageUrls.append(imageUrl)
          time.sleep(2)
      
      for imageUrl in extractedImageUrls:
        imageUrl = imageUrl.split('=')[0]
        imageUrl = f"{imageUrl}=w1000"
        response = requests.get(imageUrl)
        
        with open(f'./images/{time.time()}.png', 'wb') as file:
          savedImages.append(file.name)
          file.write(response.content)

      review_myened = element.find_elements(By.CLASS_NAME, "MyEned")
      if len(review_myened) > 0:
          review_myened_text = review_myened[0].text
          review_myened_text = review_myened_text.replace('\n', ' ')
          review_myened_text = review_myened_text.replace('  ', ' ')
          review_myened_text = review_myened_text.strip()
          messages.append({
            'content': f'{review_myened_text}',
            'images': extractedImageUrls
          })

    # with open(f'data.json', 'w') as file:
    #   file.write(str(messages))
    return messages

  except Exception as e:
    print(f'Error in open_website: {e}')
    driver.quit()
    return []
  
# asyncio.run(open_website("https://www.google.com/maps/place/Choriqulboy+ko%E2%80%98prigi/@39.9298483,64.3684854,13.69z/data=!4m17!1m8!3m7!1s0x3f697e1ed749a4f3:0xb928388bac4b8a1d!2sTejen,+Turkmenistan!3b1!8m2!3d37.3743044!4d60.5008307!16zL20vMDN3ZDNn!3m7!1s0x3f500b77a18d8667:0x22892aa26240d836!8m2!3d39.9231045!4d64.3836869!9m1!1b1!16s%2Fg%2F11n09ysncl?entry=ttu&g_ep=EgoyMDI0MTAwNy4xIKXMDSoASAFQAw%3D%3D"))
# print('Done')