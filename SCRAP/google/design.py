import os
import tkinter as tk
from tkinter import ttk
from review import open_website
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import time
import asyncio


class MainApplication(tk.Frame):
  def get_chrome_mac_path():
    paths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      os.path.expanduser("~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    ]
    for path in paths:
      if os.path.exists(path):
        return True
    return False
  
  def get_firefox_mac_path():
    paths = [
      "/Applications/Firefox.app/Contents/MacOS/firefox",
      os.path.expanduser("~/Applications/Firefox.app/Contents/MacOS/firefox")
    ]
    for path in paths:
      if os.path.exists(path):
        return True
    return False
  
  def installWebdriver(self):
    self.responseText.delete("1.0", tk.END)
    self.responseText.insert("1.0", "Installing driver...")
    current_browser = self.browser.get()
    if current_browser == 'chrome':
      browser_path = MainApplication.get_chrome_mac_path()
      if browser_path:
        self.driver_path = ChromeDriverManager().install()
        self.driverPath.set(self.driver_path)

        self.responseText.delete("1.0", tk.END)
        self.responseText.insert("1.0", "Driver installed.")
      else:
        self.responseText.delete("1.0", tk.END)
        self.responseText.insert("1.0", "Chrome not found in standard paths.")

  def openWebsite(self):
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
    self.searchQuery.set(url)
    comments = asyncio.run(open_website(url, driver))
    print(comments)



    # url = "https://www.google.com/maps"
    # driver.get(url)
    # WebDriverWait(driver, 10).until(
    #   lambda d: d.execute_script('return document.readyState') == 'complete'
    # )

    time.sleep(5)
  def __init__(self, parent, *args, **kwargs):
    tk.Frame.__init__(self, parent, *args, **kwargs)
    self.parent = parent

    # Title
    root.title("Google review scraper")
    root.geometry("400x600")

    # Check browser
    browserFrame = tk.LabelFrame(text="Browser", padx=10, pady=10)
    self.browser = tk.StringVar()
    self.browser.set('chrome')
    browserMenu = tk.OptionMenu(browserFrame, self.browser, 'chrome', 'firefox')
    browserMenu.pack(fill="x")
    browserCheck = tk.Button(browserFrame, text="Check and install driver", command=self.installWebdriver)
    browserCheck.pack(fill="x")

    self.driverPath = tk.StringVar()
    self.driverPath.set('C:/chromedriver.exe')
    tk.Label(self, text="Webdriver path").pack()
    tk.Entry(self, textvariable=self.driverPath).pack()
    
    self.responseText = tk.Text(browserFrame, height=1)
    self.responseText.insert("1.0", "")
    self.responseText.pack(fill="x")

    browserFrame.pack(fill="x", padx=10, pady=10)

    # Search frame
    searchFrame = tk.LabelFrame(text="Search", padx=10, pady=10)
    tk.Label(searchFrame, text="Search query").pack(fill="x")
    self.searchQuery = tk.StringVar()
    tk.Entry(searchFrame, textvariable=self.searchQuery).pack(fill="x")
    self.headless = tk.BooleanVar()
    tk.Checkbutton(searchFrame, text="Headless", variable=self.headless).pack(fill="x")
    searchButton = tk.Button(searchFrame, text="Search", command=self.openWebsite)
    searchButton.pack(fill="x")
    searchFrame.pack(fill="x", padx=10, pady=10)

    # Frame
    resultsFrame = tk.LabelFrame(text="Results", padx=10, pady=10)
    columns = ["Name", "Rating", "Date", "Review"]
    tree = ttk.Treeview(resultsFrame, columns=columns, show="headings")
    for col in columns:
      tree.heading(col, text=col)
    tree.pack(fill="both", expand=True)
    resultsFrame.pack(fill="both", expand=True, padx=10, pady=10)


    # Download button
    downloadButton = tk.Button(text="Download results")
    downloadButton.pack(fill="x", padx=10)
    

if __name__ == "__main__":
  root = tk.Tk()
  MainApplication(root).pack(side="top", fill="both", expand=True, padx=200, pady=200)
  root.mainloop()