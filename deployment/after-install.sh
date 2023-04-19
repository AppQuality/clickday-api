#!/bin/bash
set -euo pipefail


PROJECT_NAME="tryber-cd-api"

# enable and start docker service
systemctl enable docker.service
systemctl start docker.service

# login to ecr
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 163482350712.dkr.ecr.eu-west-1.amazonaws.com

# read docker image version from manifest
DOCKER_IMAGE=$(cat "/home/ec2-user/$PROJECT_NAME/docker-image.txt")
DOCKER_COMPOSE_FILE="/home/ec2-user/$APPLICATION_NAME/docker-compose.yml"
INSTANCE_ID=$(wget -q -O - http://169.254.169.254/latest/meta-data/instance-id)
ENVIRONMENT=$(aws ec2 describe-tags --filters "Name=resource-id,Values=$INSTANCE_ID" "Name=key,Values=environment"  --output=text | cut -f5)

# pull docker image from ecr
docker pull 163482350712.dkr.ecr.eu-west-1.amazonaws.com/$DOCKER_IMAGE

# get env variables from parameter store
mkdir -p /home/ec2-user/$APPLICATION_NAME
mkdir -p /var/docker
aws ssm get-parameter --region eu-west-1 --name "/tryber/clickday/api/$ENVIRONMENT/.env" --with-decryption --query "Parameter.Value" | sed -e 's/\\n/\n/g' -e 's/\\"/"/g' -e 's/^"//' -e 's/"$//' > /var/docker/.env

source /var/docker/.env
if test -f "$DOCKER_COMPOSE_FILE"; then
    set +e
    IS_RUNNING=$(docker ps -a | grep $DOCKER_IMAGE| wc -l)
    set -e
    if [ "$IS_RUNNING" -eq "1" ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE down
    fi
fi    

arrIN=(${DOCKER_IMAGE//:/ })
DOCKER_IMAGE_TAG=${arrIN[1]}   


echo "
version: '3'
services:
  app:
    image: 163482350712.dkr.ecr.eu-west-1.amazonaws.com/$DOCKER_IMAGE
    restart: always
    ports:
      - '80:80'
    environment:
      PORT: 80
      API_ROOT: ${API_ROOT}
      JWT_SECRET: '${JWT_SECRET}'
      JWT_EXPIRATION: '${JWT_EXPIRATION}'
      WP_LOGGED_IN_KEY: '${WP_LOGGED_IN_KEY}'
      WP_LOGGED_IN_SALT: '${WP_LOGGED_IN_SALT}'
      DB_HOST: '${DB_HOST}'
      DB_PORT: '${DB_PORT}'
      DB_USER: '${DB_USER}'
      DB_PASSWORD: '${DB_PASSWORD}'
      DB_NAME: '${DB_NAME}'
      CLICKDAY_DB_HOST: '${CLICKDAY_DB_HOST}'
      CLICKDAY_DB_USER: '${CLICKDAY_DB_USER}'
      CLICKDAY_DB_PASSWORD: '${CLICKDAY_DB_PASSWORD}'
      CLICKDAY_DB_DATABASE: '${CLICKDAY_DB_DATABASE}'
      CROWD_URL: '${CROWD_URL}'
      CONNECTION_COUNT: ${CONNECTION_COUNT}
    logging:
      driver: awslogs
      options:
        awslogs-region: eu-west-1
        awslogs-group: "${PROJECT_NAME}-${ENVIRONMENT}-${ENVIRONMENT}"
        awslogs-stream: ${DOCKER_IMAGE_TAG}
        awslogs-create-group: 'true'
" > $DOCKER_COMPOSE_FILE


docker-compose -f $DOCKER_COMPOSE_FILE up -d
