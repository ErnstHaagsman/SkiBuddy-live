#!/bin/bash

docker build -t skibuddy-live .
docker run -it --rm --name skibuddy-server -p 8282:8282 skibuddy-live