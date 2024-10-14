from setuptools import setup
# /opt/homebrew/Cellar/openssl@3/3.3.2
openssl_libs = [
  '/opt/homebrew/Cellar/openssl@3/3.3.2/lib/libssl.3.dylib',
  '/opt/homebrew/Cellar/openssl@3/3.3.2/lib/libcrypto.3.dylib',
]
APP = ['main.py']  # Replace with your main Python script
DATA_FILES = [
  ('', openssl_libs),
]
OPTIONS = {
  'argv_emulation': True,
  # 'packages': ['requests', 'selenium'],  # List all required packages
  # 'includes': ['ctypes'],  # Include ctypes explicitly
  'frameworks': ['/opt/homebrew/opt/libffi/lib/libffi.8.dylib'],
  'packages': ['ssl'],
  'includes': ['libssl.3.dylib', 'libcrypto.3.dylib']
  # 'packages': [
    # 'requests',
    # 'selenium',
    # 'webdriver_manager',
    # 'ttkbootstrap',
    # 'webdriver',
    # 'websocket'
  # ]
}

setup(
  app=APP,
  data_files=DATA_FILES,
  options={'py2app': OPTIONS},
  setup_requires=['py2app'],
)
