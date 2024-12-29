# GMR Scrap

## Installation

### Prerequisites

- Docker
- Docker Compose

### Steps

docker network create --driver=bridge --subnet=172.10.0.0/24 gmrsc-network
docker-compose -p gmrscrap --env-file .env.dev build
docker-compose -p gmrscrap --env-file .env.dev up -d
