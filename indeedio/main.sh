echo "Start running python script"

# VERSIONS PYTHON AND PIP
echo "Python version"
python3 --version

echo "Pip version"
pip3 --version

Xvfb :99 -screen 0 1920x1080x24 -nolisten tcp -auth /dev/null &
export DISPLAY=:99

# check if Xvfb is running
ps aux | grep Xvfb

pip3 install virtualenv
pip3 install PyAutoGUI
pip3 install python-xlib

virtualenv .venv
source .venv/bin/activate

# install requirements
sudo pip3 install -r requirements.txt
echo "Running example SeleniumBase"

# chrome path
echo "Chrome path"
which google-chrome

# python3 test_google.py
# run with xvfb
# Xvfb :99 -ac -screen 0 1280x1024x16 &
# export DISPLAY=:99
sudo python3 test_google.py
# exec "$@"
echo "End running python script"