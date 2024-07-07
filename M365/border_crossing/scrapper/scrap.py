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

# Use webdriver-manager to handle Chromedriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Your test script
driver.get("http://www.example.com")
print(driver.title)
driver.quit()
