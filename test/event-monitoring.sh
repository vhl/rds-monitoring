#!/bin/bash

lambda-local -l ../src/index.js -h handler -t 60 \
  -e fixtures/sns-rds-event.json \
  -E '{"DEBUG": "true", "SLACK_WEBHOOK_URL": "https://localhost", "SLACK_CHANNEL": "#rds"}'
