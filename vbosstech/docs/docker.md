# Docker

## Install

Install `docker`, `docker-compose` cmd

+ docker

```bash
curl -fsSL get.docker.com -o get-docker.sh
sh get-docker.sh
```

+ docker-compose

```bash
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Yaml file

+ Network, Link

Links have been replaced by networks. Docker describes them as a legacy feature that you should avoid using. You can safely remove the link and the two containers will be able to refer to each other by their service name (or container_name).

With compose, links do have a side effect of creating an implied dependency. You should replace this with a more explicit depends_on section so that the app doesn't attempt to run without or before redis starts.

```yaml
version: '2'
# do not forget the version line, this file syntax is invalid without it

services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    networks:
      - lognet

  app:
    container_name: web-app
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ".:/webapp"
    depends_on:
      - redis
    networks:
      - lognet

networks:
  lognet:
    driver: bridge
```

Use case: reuse already running `mongodb` container

```bash
+ mongodb is running
+ mongodb exist under network, name: docker_default
+ mongodb as `hostname alias` in docker_default
+ start NEW SERVICE in yaml file
+ these services ONLY UNDER network of these services
+ we HAVE TO explicit which network to attach services in
+ OK, point back to `docker_default`
+ now new service, can see `mongodb` as normal
```