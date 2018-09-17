#!/bin/bash

# Copyright 2018 Vista Higher Learning, Inc.
# Copyright 2018 Jesse Cotton <jcotton@bitlancer.com>
#
# Licensed under the Apache License, Version 2.0 (the "License"); you
# may not use this file except in compliance with the License.  You
# may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied.  See the License for the specific language governing
# permissions and limitations under the License.

lambda-local -l ../src/index.js -h handler -t 60 \
  -e fixtures/cloudwatch-scheduled-event.json \
  -E '{"DEBUG": "true", "LOG_MONITORING_INTERVAL": "10", "SLACK_WEBHOOK_URL": "https://localhost", "SLACK_CHANNEL": "#rds"}'
