import asyncio
from asyncio import subprocess
import os
import tkinter as tk
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from review import open_website
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.support.ui import WebDriverWait
import time

class MainApplication(tk.Frame):
  def installWebdriver(self):
    # driver_path = ChromeDriverManager().install()
    # self.driverPath.set(driver_path)
    if self.browser.get() == 'chrome':
      driver_path = ChromeDriverManager().install()
      self.driverPath.set(driver_path)
    elif self.browser.get() == 'firefox':
      driver_path = GeckoDriverManager().install()
      self.driverPath.set(driver_path)

  def openWebsite(self):
    # options = webdriver.ChromeOptions()
    # if self.headless.get():
    #   options.add_argument("--headless")
    # options.add_argument("--lang=en")
    # service = Service(self.driverPath.get())
    # driver = webdriver.Chrome(
    #   service=service,
    #   options=options
    # )

    if self.browser.get() == 'chrome':
      options = webdriver.ChromeOptions()
      if self.headless.get():
        options.add_argument("--headless")
      options.add_argument("--lang=en")
      service = Service(self.driverPath.get())
      driver = webdriver.Chrome(
        service=service,
        options=options
      )
    elif self.browser.get() == 'firefox':
      options = webdriver.FirefoxOptions()
      if self.headless.get():
        options.add_argument("--headless")
      options.add_argument("--lang=en")
      service = Service(self.driverPath.get())
      driver = webdriver.Firefox(
        service=service,
        options=options
      )

    url = "https://www.google.com/maps/place/Restaarant/@40.0381748,64.3964387,17.12z/data=!4m8!3m7!1s0x3f5076e4aaf30cc7:0xd306d5459a0bddcd!8m2!3d40.0381984!4d64.3964598!9m1!1b1!16s%2Fg%2F11bbt40l74?entry=ttu&g_ep=EgoyMDI0MTAwOC4wIKXMDSoASAFQAw%3D%3D"
    comments = asyncio.run(open_website(url, driver))
    print(comments)

    # url = "https://www.google.com/maps"
    # driver.get(url)
    # WebDriverWait(driver, 10).until(
    #   lambda d: d.execute_script('return document.readyState') == 'complete'
    # )

    time.sleep(5)
  
  def get_chrome_mac_path():
    paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        os.path.expanduser("~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    ]
    for path in paths:
        if os.path.exists(path):
            return path
    return "Google Chrome not found in standard paths."
  
  def get_firefox_mac_path():
    paths = [
        "/Applications/Firefox.app/Contents/MacOS/firefox",
        os.path.expanduser("~/Applications/Firefox.app/Contents/MacOS/firefox")
    ]
    for path in paths:
        if os.path.exists(path):
            return path
    return "Firefox not found in standard paths."

  def __init__(self, parent, *args, **kwargs):
    tk.Frame.__init__(self, parent, *args, **kwargs)
    self.parent = parent
    # Title
    self.parent.title("Google review scraper")

    # Check browser
    self.browser = tk.StringVar()
    self.browser.set('chrome')
    tk.Label(self, text="Browser").pack()
    tk.OptionMenu(self, self.browser, 'chrome', 'firefox').pack()

    # Check browser path
    self.browserPath = tk.StringVar()
    self.browserPath.set(MainApplication.get_chrome_mac_path())
    tk.Label(self, text="Browser path").pack()
    tk.Entry(self, textvariable=self.browserPath).pack()

    # Check browser path
    self.browserPath = tk.StringVar()
    self.browserPath.set(MainApplication.get_firefox_mac_path())
    tk.Label(self, text="Browser path").pack()
    tk.Entry(self, textvariable=self.browserPath).pack()
    
    # Check webdriver path
    self.driverPath = tk.StringVar()
    self.driverPath.set('C:/chromedriver.exe')
    tk.Label(self, text="Webdriver path").pack()
    tk.Entry(self, textvariable=self.driverPath).pack()

    # Install by default the webdriver button
    tk.Button(self, text="Install webdriver", command=self.installWebdriver).pack()

    # Checkbox to enable headless mode
    self.headless = tk.BooleanVar()
    self.headless.set(True)
    tk.Checkbutton(self, text="Headless mode", variable=self.headless).pack()

    # Open website button
    tk.Button(self, text="Open website", command=self.openWebsite).pack()



if __name__ == "__main__":
  root = tk.Tk()
  MainApplication(root).pack(side="top", fill="both", expand=True, padx=200, pady=200)
  root.mainloop()