from telethon import TelegramClient
api_id = 2597670
api_hash = 'b297821038840dd1d60a471f71105cd2'
client = TelegramClient('session_name', api_id, api_hash)
client.start()

shakhi = 'https://t.me/shakhrillo'
# me = client.get_me()
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.action_chains import ActionChains
# import time

# # set default language to english
# options = webdriver.ChromeOptions()
# options.add_argument("--headless")
# options.add_argument("--lang=en")

# # Set up the WebDriver (assuming you have ChromeDriver installed and in your PATH)
# driver = webdriver.Chrome()
# # driver = webdriver.Safari(options=options)


# # Define the URL of the website you want to scrape
# url = 'https://www.google.com/maps/place/Tamozhennyy+Post+%22Daut-Ata%22/@44.8992367,56.006828,15z/data=!4m17!1m8!3m7!1s0x41bf9b8e9b302a51:0x643d0fa53cbe9a05!2sTazhen,+Kazakhstan!3b1!8m2!3d44.8908593!4d55.9821541!16s%2Fg%2F125_j8h4t!3m7!1s0x41bf9b2d43308821:0x67128803236dd5ba!8m2!3d44.8943406!4d55.9998326!9m1!1b1!16s%2Fg%2F11qgyfj2g4?entry=ttu'

# # Open the webpage
# driver.get(url)

# time.sleep(2)

# # Find the button with role='tab' and click it
# # tab_button = driver.find_element(By.XPATH, "//button[@role='tab']")
# # print(tab_button)
# # tab_button.click()

# # scroll and wait for the content to load
# vyucnb = driver.find_element(By.XPATH, "//div[@class='vyucnb']")
# parentElmOfvyucnb = vyucnb.find_element(By.XPATH, "..")
# # scroll height
# scrollHeight = parentElmOfvyucnb.get_attribute("scrollHeight")
# # print(parentElmOfvyucnb.get_attribute("scrollHeight"))
# # scroll to the bottom of the page parentElmOfvyucnb
# # driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
# # # wait for the content to load
# # time.sleep(2)
# while True:
#     driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
#     time.sleep(2)
#     newScrollHeight = parentElmOfvyucnb.get_attribute("scrollHeight")
#     see_more_buttons = driver.find_elements(By.XPATH, "//div[@aria-label='See more']")

#     # click the see more button
#     for i in see_more_buttons:
#         i.click()

#     if newScrollHeight == scrollHeight:
#         break
#     scrollHeight = newScrollHeight


# # find all class with the name MyEned
# MyEned = driver.find_elements(By.CLASS_NAME, "MyEned")
# # print(MyEned)

# csv = []

# # iterate and log inside context
# for i in MyEned:
#     # print(i.text)
#     csv.append(i.text)

# # Wait for the content to load (this may need to be adjusted based on the website's loading time)
# time.sleep(2)

# # Extract the content from the resulting tab
# # Adjust the selector to match the content you want to extract
# # content = driver.find_element(By.XPATH, "//div[@class='content-class']")
# # print(content.text)

# # Close the WebDriver
# # driver.quit()

# # save the csv
# with open('border_crossing.csv', 'w') as f:
#     for item in csv:
#         f.write("%s\n" % item)



from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# from selenium import webdriver
from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.action_chains import ActionChains
import time

options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--lang=en")

# Use webdriver-manager to handle Chromedriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(
    service=service,
    options=options
)

# Your test script
# driver.get("http://www.example.com")
# print(driver.title)
# driver.quit()



# Define the URL of the website you want to scrape
url = 'https://www.google.com/maps/place/Tamozhennyy+Post+%22Daut-Ata%22/@44.8992367,56.006828,15z/data=!4m17!1m8!3m7!1s0x41bf9b8e9b302a51:0x643d0fa53cbe9a05!2sTazhen,+Kazakhstan!3b1!8m2!3d44.8908593!4d55.9821541!16s%2Fg%2F125_j8h4t!3m7!1s0x41bf9b2d43308821:0x67128803236dd5ba!8m2!3d44.8943406!4d55.9998326!9m1!1b1!16s%2Fg%2F11qgyfj2g4?entry=ttu'

# Open the webpage
driver.get(url)

time.sleep(2)

# Find the button with role='tab' and click it
# tab_button = driver.find_element(By.XPATH, "//button[@role='tab']")
# print(tab_button)
# tab_button.click()
retry = 20
# scroll and wait for the content to load
# vyucnb = driver.find_element(By.XPATH, "//div[@class='vyucnb']")
vyucnb = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[@class='vyucnb']")))
# print(vyucnb)
if not vyucnb:
    while retry > 0:
        vyucnb = driver.find_element(By.XPATH, "//div[@class='vyucnb']")
        print('searching for element')
        if vyucnb:
            break
        retry -= 1
        time.sleep(2)
    if retry == 0:
        print('Element not found')
        driver.quit()
        exit(1)

parentElmOfvyucnb = vyucnb.find_element(By.XPATH, "..")
# scroll height
scrollHeight = parentElmOfvyucnb.get_attribute("scrollHeight")
# print(parentElmOfvyucnb.get_attribute("scrollHeight"))
# scroll to the bottom of the page parentElmOfvyucnb
# driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
# # wait for the content to load
# time.sleep(2)
while True:
    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
    time.sleep(2)
    newScrollHeight = parentElmOfvyucnb.get_attribute("scrollHeight")
    # document.querySelectorAll('button[aria-label="See more"]');
    # see_more_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='See more']")

    if newScrollHeight == scrollHeight:
        break
    scrollHeight = newScrollHeight


# find all class with the name MyEned
MyEned = driver.find_elements(By.CLASS_NAME, "MyEned")
# print(MyEned)

# select all buttons
# print(all_buttons)

# wait = WebDriverWait(driver, 10)
# button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '.w8nwRe')))
#         button.click()
# all_buttons = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//button")))
# time.sleep(10)
all_buttons = driver.find_elements(By.XPATH, "//button")
# time.sleep(10)
print(len(all_buttons))
# target_button = None
count = 0
# for button in all_buttons:
#     if button is not None and 'expandReview' in button.get_attribute('jsaction'):
#         count += 1
#         print('clicking see more')
#         print(count)
#         # target_button = button
#         driver.execute_script("arguments[0].click();", button)
#         time.sleep(2)




# print(target_button)

# if target_button:
#     # Ensure the button is clickable and then click it
#     wait = WebDriverWait(driver, 10)
#     target_button = wait.until(EC.element_to_be_clickable(target_button))
#     target_button.click()
# else:
#     print("Target button not found")
if len(all_buttons) != 0:
    for i in all_buttons:
        # see more
        # print(i.get_attribute('jsaction'))
        # print('\n')
        # includes text expandReview
        if i.get_attribute('jsaction') is not None and 'expandReview' in i.get_attribute('jsaction'):
        # if 'expandReview' in i.get_attribute('jsaction'):
            print('clicking see more')
            time.sleep(2)
            print('clicking see more')
            i.click()
            # time.sleep(2)
            time.sleep(2)
        # print(i.text)

print('--' * 20)
# print(see_more_buttons)

# click the see more button
# for i in see_more_buttons:
#     print(i)
#     i.click()
#     time.sleep(2)

csv = []
messages = []

# iterate and log inside context
for i in MyEned:
    # print(i.text)
    csv.append(i.text)
    messages.append(i.text)

# Wait for the content to load (this may need to be adjusted based on the website's loading time)
time.sleep(2)

# Extract the content from the resulting tab
# Adjust the selector to match the content you want to extract
# content = driver.find_element(By.XPATH, "//div[@class='content-class']")
# print(content.text)

# Close the WebDriver
driver.quit()


# send all messages to the telegram @shakhi
def send_message(messages):
    async def send_messages():
        for message in messages:
            await client.send_message(shakhi, message)
    client.loop.run_until_complete(send_messages())
    print('Done')

send_message(messages)

print('Done')

# save the csv
# with open('border_crossing.csv', 'w') as f:
#     for item in csv:
#         f.write("%s\n" % item)
