from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
import time
import subprocess

class ReloadOnChange(FileSystemEventHandler):
  def on_modified(self, event):
    if event.src_path.endswith(".py"):
      print(f"Detected change in {event.src_path}, restarting script...")
      subprocess.Popen(["python", "your_script.py"])

if __name__ == "__main__":
  path = "."
  event_handler = ReloadOnChange()
  observer = Observer()
  observer.schedule(event_handler, path, recursive=True)
  observer.start()

  try:
    while True:
      time.sleep(1)
  except KeyboardInterrupt:
    observer.stop()

  observer.join()
