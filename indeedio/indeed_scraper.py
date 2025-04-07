from bs4 import BeautifulSoup
from selenium import webdriver
import time
from selenium.webdriver.common.proxy import Proxy
from selenium.webdriver.common.proxy import ProxyType

proxy_user = 'brd-customer-hl_9950f6fc-zone-residential_proxy1'
proxy_pass = 'b1eqpuwiee54'
proxy_address = 'brd.superproxy.io'
proxy_port = 33335

url = 'http://indeed.com'

proxy = f'{proxy_user}:{proxy_pass}@{proxy_address}:{proxy_port}'

def test_indeed_scraper():
    driver = setup()

    time.sleep(5)

    teardown(driver)
    
def setup():
    options = get_default_chrome_options()
    options.add_argument(f'--proxy-server=http://{proxy}')
    driver = webdriver.Chrome(options=options)
    driver.get(url)  # Open the Indeed website

    return driver

def get_default_chrome_options():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    return options

def teardown(driver):
    driver.quit()

test_indeed_scraper()
