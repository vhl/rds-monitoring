#!/bin/bash

lambda-local -l ../src/index.js -h handler -t 60 \
  -e fixtures/cloudwatch-scheduled-event.json \
  -E '{"DEBUG": "true", "LOG_MONITORING_INTERVAL": "10", "SLACK_WEBHOOK_URL": "https://localhost", "SLACK_CHANNEL": "#rds"}'
