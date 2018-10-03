#!/bin/bash
# Build docker image
cd $WORKSPACE
docker build . --tag vbosstech/servicebot:latest
docker login -u vbosstech -p vboss.tech
docker push vbosstech/servicebot:latest