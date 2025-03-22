from seleniumbase import Driver
import json
# from utils.extract_salary_type import extract_salary_and_type
from utils.extract_job_details import extract_job_details

def scrape_jobs_from_page(driver, results):
    print("Scraping jobs from page...")
    website_title = driver.get_title()
    print(website_title)
    driver.uc_gui_click_captcha()
    driver.sleep(2)
    driver.uc_gui_handle_captcha()
    print("Captcha handled")
    driver.wait_for_element(".jobsearch-RichSearch", timeout=20)
    for tag in driver.find_elements("a[id^='job_']"):
        job_url = tag.get_attribute("href")
        print(job_url)
        if not job_url:
            continue
        driver.execute_script("window.open(arguments[0]);", job_url)
        driver.switch_to_window(-1)
        # driver.uc_gui_click_captcha()

        driver.uc_gui_click_captcha()
        driver.sleep(2)
        driver.uc_gui_handle_captcha()
        
        selectors = {
            "title": ".jobsearch-JobInfoHeader-title",
            "description": "#jobDescriptionText",
            "company_location": "div[data-testid='inlineHeader-companyLocation']",
            "company_name": "div[data-testid='inlineHeader-companyName']"
        }
        
        data = {"url": job_url}
        
        for key, selector in selectors.items():
            if driver.is_element_present(selector):
                data[key] = driver.find_element(selector).text
            else:
                data[key] = None
        
        data.update(extract_job_details(driver))
        
        if data.get("title") and data.get("description"):
            results.append(data)
        
        driver.close()
        driver.switch_to.window(driver.window_handles[0])
        driver.sleep(2)

def scrape_all_pages(driver, url):
    print("Scraping all pages...")
    driver.uc_open_with_reconnect(url, 4)
    # driver.uc_gui_click_captcha()

    driver.uc_gui_click_captcha()
    driver.sleep(2)
    driver.uc_gui_handle_captcha()

    results, current_page = [], 1
    
    while True:
        scrape_jobs_from_page(driver, results)
        try:
            driver.find_element("a[data-testid='pagination-page-next']").click()
            driver.sleep(5)
        except:
            break
        if current_page >= 1:
            break
        current_page += 1
    
    return results

if __name__ == "__main__":
    driver = Driver(uc=True)
    try:
        results = scrape_all_pages(driver, "https://www.indeed.com/jobs?q=software+developer&l=remote")
        with open("jobs.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        driver.quit()
        print("Scraping complete!")