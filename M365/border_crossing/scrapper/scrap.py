from telethon import TelegramClient
api_id = 2597670
api_hash = 'b297821038840dd1d60a471f71105cd2'
tlclient = TelegramClient('session_name', api_id, api_hash)
tlclient.start()

shakhi = 'https://t.me/shakhrillo'

from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key='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')

# shakhi = 'https://t.me/tmukhammad'
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
# url = 'https://www.google.com/maps/place/Tamozhennyy+Post+%22Daut-Ata%22/@44.8992367,56.006828,15z/data=!4m17!1m8!3m7!1s0x41bf9b8e9b302a51:0x643d0fa53cbe9a05!2sTazhen,+Kazakhstan!3b1!8m2!3d44.8908593!4d55.9821541!16s%2Fg%2F125_j8h4t!3m7!1s0x41bf9b2d43308821:0x67128803236dd5ba!8m2!3d44.8943406!4d55.9998326!9m1!1b1!16s%2Fg%2F11qgyfj2g4?entry=ttu'
# url = 'https://www.google.com/maps/place/Border+Crossing+Subteniente+Lopez/@16.915514,-101.206387,6.09z/data=!4m12!1m2!2m1!1sborder+crossing+station!3m8!1s0x8f5bbc1896e5e205:0x37b9780b59f52651!8m2!3d18.4930352!4d-88.3953326!9m1!1b1!15sChdib3JkZXIgY3Jvc3Npbmcgc3RhdGlvbpIBF2JvcmRlcl9jcm9zc2luZ19zdGF0aW9u4AEA!16s%2Fg%2F11c318zp0k?entry=ttu'
# url = 'https://www.google.com/maps/place/General+Directorate+of+the+Civil+Guard/@35.8718424,-5.3743246,14z/data=!4m12!1m2!2m1!1sborder+crossing+station!3m8!1s0xd0ca1709f2847fd:0x151bfb5a6281bc42!8m2!3d35.8718885!4d-5.3443465!9m1!1b1!15sChdib3JkZXIgY3Jvc3Npbmcgc3RhdGlvbloZIhdib3JkZXIgY3Jvc3Npbmcgc3RhdGlvbpIBDWd1YXJkaWFfY2l2aWyaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUkNiemxEVTA1M0VBReABAA!16s%2Fg%2F12qfbhsz8?entry=ttu'
# url = 'https://www.google.com/maps/place/Frontera+La+L%C3%ADnea+-+Gibraltar/@36.1550185,-5.3833946,14z/data=!4m12!1m2!2m1!1sborder+crossing+station!3m8!1s0xd0cc08899d9f12f:0xe73c210a5b3c2557!8m2!3d36.1550185!4d-5.3483757!9m1!1b1!15sChdib3JkZXIgY3Jvc3Npbmcgc3RhdGlvbloZIhdib3JkZXIgY3Jvc3Npbmcgc3RhdGlvbpIBF2JvcmRlcl9jcm9zc2luZ19zdGF0aW9umgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJQT1U5cE9YWm5SUkFC4AEA!16s%2Fg%2F11cmt9fzkc?entry=ttu'
url = "https://www.google.com/maps/place/Jartepa+chegara+bojxona+posti/@39.5175648,67.3988608,16.59z/data=!4m8!3m7!1s0x38b32d3256b959fd:0x41cd5fb798a2920b!8m2!3d39.5186513!4d67.3981091!9m1!1b1!16s%2Fg%2F11qgt1pdv4?entry=ttu"

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
driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", parentElmOfvyucnb)
# wait for the content to load
time.sleep(2)
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
if len(all_buttons) != 0:
    for button in all_buttons:
        # if button is not None and 'expandReview' in button.get_attribute('jsaction'):
        attr = button.get_attribute('jsaction')
        if attr is not None and 'expandReview' in attr:
            count += 1
            print('clicking see more')
            print(count)
            # target_button = button
            driver.execute_script("arguments[0].click();", button)
            time.sleep(2)
        
        if attr is not None and 'showReviewInOriginal' in attr:
            count += 1
            print('clicking see more')
            print(count)
            # target_button = button
            driver.execute_script("arguments[0].click();", button)
            time.sleep(2)


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

_string_messages = '\n'.join(messages)

jsonexample = """
{
    "is_open": boolean,
    "border_name": string,
    "border_type": string,
    "border_status": string,
    "border_country": string,
    "border_region": string,
    "border_city": string,
    "border_lat": float,
    "border_lng": float,
    "border_open_time": string,
    "border_close_time": string,
    "border_open_days": string,
    "border_phone": string,
    "border_email": string,
    "border_website": string,
    "border_address": string,
    "border_description": string,

    "info": {
        "waiting_time": string,
        "toilet": string,
        "food": string,
        "accommodation": string,
        "wifi": string,
        "atm": string,
        "fuel": string,
        "parking": string,
        "customs": string,
    }

    "get_here": {
        "by_car": string,
        "by_bus": string,
        "by_train": string,
        "by_plane": string,
        "by_ship": string,
    },

    "documents": {
        "passport": string,
        "visa": string,
        "vehicle_registration": string,
        "driver_license": string,
        "customs_declaration": string,
        "health_insurance": string,
        "vaccination": string,
        "other": string,
    },

    "considirations": {
        "bribe": string,
        "corruption": string,
        "smuggling": string,
        "security": string,
        "safety": string,
        "health": string,
        "money": string,
        "other": string,  
    },
    
    "overview": object,
}
"""

response = client.chat.completions.create(
#   model="gpt-4o",
  model="gpt-3.5-turbo",
#   response_format={ "type": "json_object" },
  messages=[
    {"role": "system", "content": "You are a helpful assistant for reviewing border crossing points."},
    {"role": "user", "content": _string_messages + '  ' + url},
    {"role": "user", "content": 'Give the time, as the json' + jsonexample}
  ]
)
print(response.choices[0].message.content)

# send all messages to the telegram @shakhi
def send_message():
    async def send_messages():
        await tlclient.send_message(shakhi, response.choices[0].message.content)
    tlclient.loop.run_until_complete(send_messages())
    print('Done')

send_message()

print('Done')

# save the csv
# with open('border_crossing.csv', 'w') as f:
#     for item in csv:
#         f.write("%s\n" % item)
