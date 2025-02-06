# GMR Scrap

## Installation

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Create a `.env` file. You can use the `.env.example` file as a template.

docker-compose -p gmrscrap --env-file .env build &&
docker-compose -p gmrscrap --env-file .env up -d

Modify the Main Nginx Config
Open your main Nginx config, usually located at:

macOS: /usr/local/etc/nginx/nginx.conf
Linux: /etc/nginx/nginx.conf
Add the following inside the http {} block:

sudo nano /opt/homebrew/etc/nginx/nginx.conf
include /Users/shakhrillo/Desktop/m_main/codecanyon/gmr_scrap/demo/nginx.conf;
sudo nginx -t

sudo mkdir -p /opt/homebrew/etc/nginx/sites-available
sudo mkdir -p /opt/homebrew/etc/nginx/sites-enabled

sudo ln -s /Users/shakhrillo/Desktop/m_main/codecanyon/gmr_scrap/demo/nginx.conf /opt/homebrew/etc/nginx/sites-available/demo

sudo ln -s /opt/homebrew/etc/nginx/sites-available/demo /opt/homebrew/etc/nginx/sites-enabled/

<!-- sudo ln -s /Users/shakhrillo/Desktop/m_main/codecanyon/gmr_scrap/demo/nginx.conf /etc/nginx/sites-available/demo
sudo ln -s /etc/nginx/sites-available/demo /etc/nginx/sites-enabled/ -->

sudo rm /etc/nginx/sites-enabled/nginx.conf
sudo ln -s /root/m_main/codecanyon/gmr_scrap/demo/nginx.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

sudo rm /etc/nginx/sites-enabled/nginx.api.conf
sudo ln -s /root/m_main/codecanyon/gmr_scrap/demo/nginx.api.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
