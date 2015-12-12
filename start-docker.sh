#!/bin/bash

docker build -t skibuddy-live .
docker run -dt --name skibuddy-server -p 8282:8282 skibuddy-live
