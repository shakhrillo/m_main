from selenium import webdriver
from selenium.webdriver.safari.service import Service

# Set up Safari driver
driver = webdriver.Safari(service=Service('/usr/bin/safaridriver'))

# Open a webpage
driver.get("https://www.google.com")

# Header value
print(driver.title)

# Perform your automation tasks...

# Close the browser
driver.quit()
