from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
import pickle
import os  # To check if file exists
import time
import pyperclip

# Path to your Chrome WebDriver
driver_path = "/Users/shakhrillo/.wdm/drivers/chromedriver/mac64/129.0.6668.58/chromedriver-mac-arm64/chromedriver"
# driver_path = "/Users/shakhrillo/.wdm/drivers/chromedriver"

# URL for Facebook login
url = "https://www.facebook.com"

# Load existing cookies if they exist
def load_cookies(driver):
    if os.path.exists("fb_cookies.pkl"):
        with open("fb_cookies.pkl", "rb") as f:
            cookies = pickle.load(f)
            for cookie in cookies:
                driver.add_cookie(cookie)
        print("Cookies loaded successfully!")
    else:
        print("Cookies file not found, proceeding without cookies.")

# Save cookies for future use
def save_cookies(driver):
    with open("fb_cookies.pkl", "wb") as f:
        pickle.dump(driver.get_cookies(), f)
    print("Cookies saved successfully!")

# Check if login form is present
def is_login_page(driver):
    try:
        driver.find_element(By.ID, "email")  # Check if email input field exists
        driver.find_element(By.ID, "pass")   # Check if password input field exists
        return True
    except:
        return False

# Open Facebook and login
def facebook_login(driver, email, password):
    driver.get(url)
    time.sleep(2)  # Wait for the page to load

    # Load cookies and refresh the page
    load_cookies(driver)
    driver.get(url)

    # If login form is detected, log in manually
    if is_login_page(driver):
        print("Logging in manually...")
        email_field = driver.find_element(By.ID, "email")
        email_field.send_keys(email)

        password_field = driver.find_element(By.ID, "pass")
        password_field.send_keys(password)

        password_field.send_keys(Keys.RETURN)

        time.sleep(5)  # Wait for login to complete
        save_cookies(driver)  # Save cookies after successful login
    else:
        print("Logged in using cookies!")


# Replace these with your credentials
your_email = "st@migrant365.org"
your_password = "Xotamov1327"

# Use Chrome and keep the session saved
# service = Service(ChromeDriverManager().install())
# driver = webdriver.Chrome(service=service)
service = Service(driver_path)
driver = webdriver.Chrome(service=service)

# Login to Facebook
facebook_login(driver, your_email, your_password)

# got to the page
driver.get("https://www.facebook.com/groups/overlandmorocco")

# scroll down about 10 times
# for i in range(1):
#     driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
#     time.sleep(2)
copied_links = []
# find all by aria-label[Actions for this post]
actions = driver.find_elements(By.XPATH, "//div[@aria-label='Send this to friends or post it on your profile.']")
for action in actions:
    # click on it
    driver.execute_script("arguments[0].click();", action)
    time.sleep(1)
    # find all span text includes save and click on them
    copy_link = driver.find_element(By.XPATH, "//span[contains(text(),'WhatsApp')]")
    copy_link_parent_5 = copy_link.find_element(By.XPATH, "..").find_element(By.XPATH, "..").find_element(By.XPATH, "..").find_element(By.XPATH, "..").find_element(By.XPATH, "..")
    # print(copy_link_parent_5.get_attribute("role"))
    # driver.execute_script("arguments[0].click();", copy_link_parent_5)
    # driver.execute_script("arguments[0].click();", copy_link)
    driver.execute_script("arguments[0].click();", copy_link_parent_5)
    time.sleep(5)
    # get the link
    clipboard_data = pyperclip.paste()
    copied_links.append(clipboard_data)
    time.sleep(1)

# open the links in new tabs
for link in copied_links:
    driver.execute_script("window.open('" + link + "', '_blank');")
    time.sleep(1)



# find all span text includes reply or replies and click on them
# replies = driver.find_elements(By.XPATH, "//span[contains(text(),'reply') or contains(text(),'replies')]")
# for reply in replies:
#     # reply.click()
#     parent_of_parent = reply.find_element(By.XPATH, "..").find_element(By.XPATH, "..")
#     driver.execute_script("arguments[0].scrollIntoView(true);", parent_of_parent)
#     # click on it
#     driver.execute_script("arguments[0].click();", parent_of_parent)
#     time.sleep(1)

# replies = driver.find_elements(By.XPATH, "//span[contains(text(),'reply') or contains(text(),'replies')]")
# for reply in replies:
#     # reply.click()
#     parent_of_parent = reply.find_element(By.XPATH, "..").find_element(By.XPATH, "..")
#     driver.execute_script("arguments[0].scrollIntoView(true);", parent_of_parent)
#     # click on it
#     driver.execute_script("arguments[0].click();", parent_of_parent)
#     time.sleep(1)

time.sleep(25)
# find all style="text-align: start;" and save them as a list csv file
posts = driver.find_elements(By.XPATH, "//div[@style='text-align: start;']")
with open("posts2.csv", "w") as f:
    for post in posts:
        f.write(post.text + "\n")

time.sleep(10005)
# Close the browser
driver.quit()
