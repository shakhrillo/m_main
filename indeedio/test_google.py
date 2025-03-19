from seleniumbase import Driver
import json

results = []

driver = Driver(uc=True)  # Enable undetected Chrome
url = "https://www.indeed.com/jobs?q=software+developer&l=remote"

driver.uc_open_with_reconnect(url, 4)  # Open with reconnection attempts
driver.uc_gui_click_captcha()  # Click the CAPTCHA (if any)

# Wait for the job search results container to load
driver.wait_for_element(".jobsearch-RichSearch", timeout=10)

# Find all job links starting with "job_"
tags = driver.find_elements("a[id^='job_']")
print(f"Found {len(tags)} job links.")

for tag in tags:
    job_url = tag.get_attribute("href")
    if job_url:
        # Open the job URL in a new tab using JavaScript
        driver.execute_script("window.open(arguments[0]);", job_url)
        driver.switch_to_window(-1)  # Switch to the new tab

        # Wait for the job title to load
        driver.wait_for_element(".jobsearch-JobInfoHeader-title", timeout=30)

        # Get the job title
        title = driver.find_element(".jobsearch-JobInfoHeader-title").text

        # Get the job description
        description = driver.find_element(".jobsearch-jobDescriptionText").text

        results.append({"title": title, "description": description})
        print(f"Title: {title}")

        # Close the tab
        driver.close_window()
        driver.switch_to_window(0)  # Switch back to the main tab

        driver.sleep(5)  # Replace driver.wait(5) with sleep

# Save the results to a file
with open("jobs.json", "w") as f:
    json.dump(results, f, indent=2)

# Close the browser
driver.quit()

print(driver.get_page_title())
