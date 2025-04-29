# Project Variables
PROJECT_NAME = url-shortener
DOCKER_COMPOSE = docker compose
SERVICE = server

# Commands
up-build:
	$(DOCKER_COMPOSE)  up --build

build-no-cache:
	$(DOCKER_COMPOSE) build --no-cache

up:
	$(DOCKER_COMPOSE) up

upd:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

restart: down build upd logs

prune:
	docker system prune -f

exec:
	$(DOCKER_COMPOSE) exec $(SERVICE) sh

# Optional: clean volumes
clean:
	$(DOCKER_COMPOSE) down -v

# Optional: rebuild and restart
rebuild: clean build upd logs
