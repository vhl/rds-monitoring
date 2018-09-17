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

source config || exit 1

echo "Creating bucket $BUCKET"
aws s3 mb "s3://$BUCKET" || exit 1
echo "Bucket $BUCKET created"

echo 'Creating lambda zip artifact'
zip -j rds-monitoring.zip src/*
zip -r rds-monitoring.zip node_modules
echo 'Lambda artifact created'

echo 'Moving lambda artifact to S3'
aws s3 cp rds-monitoring.zip s3://$BUCKET/$RELEASE/rds-monitoring.zip
rm rds-monitoring.zip
echo 'Lambda artifact moved'

operation='create-stack'
aws cloudformation describe-stacks --stack-name $STACK_NAME >/dev/null 2>&1
if [ $? -eq 0 ]; then
    operation='update-stack' 
fi

echo 'Creating/Updating stack' 
aws cloudformation $operation \
    --template-body file://cloudformation/rds-monitoring.json \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --parameters \
      "ParameterKey=FilterEventsList,ParameterValue=$FILTER_EVENTS_LIST" \
      "ParameterKey=FilterLogsRegex,ParameterValue=$FILTER_LOGS_REGEX" \
      "ParameterKey=LogMonitoringInterval,ParameterValue=$LOG_MONITORING_INTERVAL_MINS" \
      "ParameterKey=ArtifactBucket,ParameterValue=$BUCKET" \
      "ParameterKey=Release,ParameterValue=$RELEASE" \
      "ParameterKey=SlackWebhookUrl,ParameterValue=$SLACK_WEBHOOK_URL" \
      "ParameterKey=SlackChannel,ParameterValue=$SLACK_CHANNEL" \
      "ParameterKey=NotificationTopicName,ParameterValue=$NOTIFICATION_TOPIC_NAME" \
      "ParameterKey=EventTopicName,ParameterValue=$EVENT_TOPIC_NAME" \
    --output text && \
echo 'Done'
