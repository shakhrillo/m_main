import time
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
# from webdriver_manager.chrome import ChromeDriverManager
from seleniumwire import webdriver

# Your Bright Data credentials
USERNAME = "brd-customer-hl_7129e5f2-zone-web_unlocker1"
PASSWORD = "0nf23dsbosl4"
# ZONE = "serp_api1"
PROXY_HOST = "brd.superproxy.io"  # Fixed proxy host
PROXY_PORT = 33335  # Bright Data's default proxy port

# PROXY = PROXY_HOST+':'+PASSWORD+'@'+USERNAME+':'+PROXY_PORT

# options = {
#      'proxy': {'https': 'http://'+PROXY, 'https': 'https://'+PROXY}
# }

API_KEY = '9bcccf3cbfcc2970b0057f4b69eb8cdb'

options = {
    'proxy': {
        'http': f'http://scraperapi:{API_KEY}@proxy-server.scraperapi.com:8001',
        'https': f'http://scraperapi:{API_KEY}@proxy-server.scraperapi.com:8001',
        'no_proxy': 'localhost,127.0.0.1'
    }
}

# options = {
#     "proxy": {
#         "http": f"http://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
#         "https": f"https://{USERNAME}:{PASSWORD}@{PROXY_HOST}:{PROXY_PORT}",
#         "verify_ssl": False,  # Turn off SSL verification (not recommended for production)
#     },
# }

# Function to start Selenium with Bright Data proxy
def start_selenium_with_proxy():
    # proxy = f"http://brd-customer-hl_7129e5f2-zone-serp_api2:vkbi1w38tz2l@brd.superproxy.io:33335"
    
    # chrome_options = Options()
    # chrome_options.add_argument(f"--proxy-server={proxy}")
    # # chrome_options.add_argument("--headless")
    # chrome_options.add_argument("--disable-gpu")
    # chrome_options.add_argument("--no-sandbox")
    # chrome_options.add_argument("--disable-dev-shm-usage")


    # Initialize WebDriver
    # service = Service(ChromeDriverManager().install())
    # driver = webdriver.Chrome(service=service, options=chrome_options)

    # driver = webdriver.Chrome(
    #     # executable_path="YOUR-CHROME-EXECUTABLE-PATH",  # Replace with the path to your ChromeDriver
    #     seleniumwire_options=options
    # )

    driver = webdriver.Chrome(seleniumwire_options = options)


    # Navigate to a test site
    print("Connecting to target website...")
    driver.get("https://www.indeed.com/jobs?q=software+developer&l=remote")
    print("Connected!")

    # Wait for 5 seconds
    time.sleep(500)

    # Close the browser
    driver.quit()

# Run the function
if __name__ == "__main__":
    start_selenium_with_proxy()
