from seleniumbase import Driver
import json

results = []

def scrape_jobs_from_page(driver):
    # Wait for the job search results container to load
    driver.wait_for_element(".jobsearch-RichSearch", timeout=10)
    
    # Find all job links starting with "job_"
    tags = driver.find_elements("a[id^='job_']")
    print(f"Found {len(tags)} job links on this page.")

    for tag in tags:
        job_url = tag.get_attribute("href")
        if job_url:
            # Open the job URL in a new tab using JavaScript
            driver.execute_script("window.open(arguments[0]);", job_url)
            driver.switch_to_window(-1)  # Switch to the new tab

            try:
                # Wait for job details to load
                driver.wait_for_element(".jobsearch-JobInfoHeader-title", timeout=10)
                driver.wait_for_element("#jobDescriptionText", timeout=10)
                driver.wait_for_element("#salaryInfoAndJobType", timeout=10)
                driver.wait_for_element("#jobDetailsSection", timeout=10)

                # Get job title
                title = driver.find_element(".jobsearch-JobInfoHeader-title").text if driver.is_element_present(".jobsearch-JobInfoHeader-title") else None
                
                # Get job description
                description = driver.find_element("#jobDescriptionText").text if driver.is_element_present("#jobDescriptionText") else None

                # Get job salary
                salary = driver.find_element("#salaryInfoAndJobType").text if driver.is_element_present("#salaryInfoAndJobType") else None

                # Get job details section
                job_details = driver.find_element("#jobDetailsSection").text if driver.is_element_present("#jobDetailsSection") else None
                
                # Store result only if both title and description exist
                if title and description:
                    results.append({
                        "url": job_url,
                        "title": title,
                        "description": description,
                        "salary": salary,
                        "job_details": job_details
                    })
                    print(f"Title: {title}")
            
            except Exception as e:
                results.append({
                    "url": job_url
                })
                print(f"Skipping job due to error: {e}")

            # Close the tab and switch back
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            driver.sleep(2)  # Small delay between jobs

def scrape_all_pages(driver, url):
    # make it headless    
    driver.uc_open_with_reconnect(url, 4)  # Open with reconnection attempts
    driver.uc_gui_click_captcha()  # Click CAPTCHA (if any)
    current_page = 1
    
    while True:
        scrape_jobs_from_page(driver)
        
        try:
            next_page_button = driver.find_element("a[data-testid='pagination-page-next']")
            next_page_button.click()
            driver.sleep(5)  # Wait for new page to load
        except:
            print("No more pages left.")
            break

        current_page += 1


        print(f"Scraped page {current_page}.")
        if current_page >= 30:
            break
        
        # Check for next page button
        # if driver.is_element_present(".pagination a[aria-label='Next']"):
        #     next_page_button = driver.find_element(".pagination a[aria-label='Next']")
        #     next_page_button.click()
        #     driver.sleep(5)  # Wait for new page to load
        # else:
        #     print("No more pages left.")
        #     break

if __name__ == "__main__":
    driver = Driver(uc=True)  # Enable undetected Chrome
    base_url = "https://www.indeed.com/jobs?q=software+developer&l=remote"
    
    try:
        scrape_all_pages(driver, base_url)
    finally:
        # Save results
        with open("jobs.json", "w") as f:
            json.dump(results, f, indent=2)
        
        # Close browser
        driver.quit()
        print("Scraping complete!")
