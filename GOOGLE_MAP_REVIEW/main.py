import asyncio
import os
import time
from review import open_website
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service

class GoogleReviewReader(ttk.Frame):
  def __init__(self, master):
    super().__init__(master, padding=15)
    self.pack(fill="both", expand="yes")
    self.create_app()

  def get_chrome_mac_path(self):
    paths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      os.path.expanduser("~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    ]
    for path in paths:
      if os.path.exists(path):
        return True
    return False
  
  def get_firefox_mac_path(self):
    paths = [
      "/Applications/Firefox.app/Contents/MacOS/firefox",
      os.path.expanduser("~/Applications/Firefox.app/Contents/MacOS/firefox")
    ]
    for path in paths:
      if os.path.exists(path):
        return True
    return False

  def installWebdriver(self):
    # self.responseText.delete("1.0", tk.END)
    # self.responseText.insert("1.0", "Installing driver...")
    current_browser = self.select_browser_combobox.get()
    if current_browser == 'Chrome':
      browser_path = self.get_chrome_mac_path()
      if browser_path:
        return ChromeDriverManager().install()
      else:
        print("Chrome not found in standard paths.")
        return None

  def search_reviews(self):
    driver = self.installWebdriver()
    url = self.search_input.get()

    if self.select_browser_combobox.get() == "Chrome":
      options = webdriver.ChromeOptions()
      # if self.headless.get():
      #   options.add_argument("--headless")
      options.add_argument("--lang=en")
      service = Service(driver)
      driver = webdriver.Chrome(
        service=service,
        options=options
      )

      self.search_results_list.delete(*self.search_results_list.get_children())
      reviews = asyncio.run(open_website(url, driver))
      for review in reviews:
        unique_id = str(time.time())
        self.search_results_list.insert("", "end", unique_id, values=("-", "-", review["content"]))
      print(reviews)

    # self.progress_bar.start()
    # self.search_results_list.delete(*self.search_results_list.get_children())
    # self.search_results_list.insert("", "end", text="1", values=("John Doe", 5, "Great place!"))
    # self.search_results_list.insert("", "end", text="2", values=("Jane Doe", 4, "Good place!"))
    # for i in range(3, 100):
    #   self.search_results_list.insert("", "end", text=i, values=("Name", 3, "Review"))
    # self.progress_bar.stop()

  def create_app(self):
    container = ttk.Labelframe(self, text="Google Review Reader")
    container.pack(fill="both", expand="yes")

    # Select browser container
    select_browser_container = ttk.Frame(container)
    select_browser_container.pack(fill="x", expand="yes")

    # Select browser label
    select_browser_label = ttk.Label(select_browser_container, text="Select Browser:")
    select_browser_label.pack(side="left", padx=10, pady=10)

    # Select browser combobox
    self.select_browser_combobox = ttk.Combobox(select_browser_container, values=["Chrome", "Firefox", "Edge"], state="readonly")
    self.select_browser_combobox.set("Chrome")
    self.select_browser_combobox.pack(side="right", padx=10, pady=10)

    search_form = ttk.Frame(container)
    search_form.pack(fill="x", expand="yes")

    # Search form label
    search_label = ttk.Label(search_form, text="URL:")
    search_label.pack(side="left", padx=10, pady=10)

    # Search form input
    self.search_input = ttk.Entry(search_form)
    self.search_input.insert(0, "https://www.google.com/maps/place/Xo%CA%BBja+Peshku+jo'me+masjidi+(+%D0%BC%D0%B5%D1%87%D0%B5%D1%82%D1%8C)/@40.0400878,64.3845308,14146m/data=!3m1!1e3!4m6!3m5!1s0x3f5a9d89e8e223d9:0x13b6e6d2cc99685!8m2!3d40.0204137!4d64.328199!16s%2Fg%2F11s7c3l2t9?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D")
    self.search_input.pack(side="right", padx=10, pady=10)

    # Search form button
    search_button = ttk.Button(container, text="Search", command=self.search_reviews)
    search_button.pack(padx=10, pady=10, expand="yes")

    # Progress bar
    self.progress_bar = ttk.Progressbar(container, length=100)
    self.progress_bar.pack(fill="x", expand="yes", padx=10, pady=10)

    # Search results
    search_results = ttk.Frame(container)
    search_results.pack(fill="both", expand="yes", padx=10)

    # Search results list
    self.search_results_list = ttk.Treeview(search_results)
    self.search_results_list.pack(fill="both", expand="yes")

    # Search results list columns
    self.search_results_list["columns"] = ("Name", "Rating", "Review")
    self.search_results_list.column("#0", width=0, stretch="no")
    self.search_results_list.column("Name", anchor="w", width=100)
    self.search_results_list.column("Rating", anchor="center", width=100)
    self.search_results_list.column("Review", anchor="w", width=200)
    
    # Search results list headings
    self.search_results_list.heading("#0", text="", anchor="w")
    self.search_results_list.heading("Name", text="Name", anchor="w")
    self.search_results_list.heading("Rating", text="Rating", anchor="center")

    # Search results list data
    # self.search_results_list.insert("", "end", text="1", values=("John Doe", 5, "Great place!"))
    # self.search_results_list.insert("", "end", text="2", values=("Jane Doe", 4, "Good place!"))
    # for i in range(3, 100):
    #   self.search_results_list.insert("", "end", text=i, values=("Name", 3, "Review"))

    # Download button container
    download_button_container = ttk.Frame(container)
    download_button_container.pack(fill="x", expand="yes")

    # Download button CSV
    download_button_csv = ttk.Button(download_button_container, text="Download CSV")
    download_button_csv.pack(padx=10, pady=10, side="right")

    # Download button Excel
    download_button_excel = ttk.Button(download_button_container, text="Download Excel")
    download_button_excel.pack(side="right", padx=10, pady=10)

    # Download button JSON
    download_button_json = ttk.Button(download_button_container, text="Download JSON")
    download_button_json.pack(side="right", padx=10, pady=10)



    

if __name__ == '__main__':
  app = ttk.Window("Text Reader", "sandstone")
  GoogleReviewReader(app)
  app.mainloop()
