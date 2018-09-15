# RDS Monitoring

Setup RDS event and log monitoring. Get notifications when:

* RDS emits events like: "A Multi-AZ failover has completed.", "The allocated storage for the DB instance has been exhausted.", "The current storage settings for this DB instance is being changed."

* RDS instance sends logs to its error log: "Aborted connection xxxx to db: 'XXX' user: 'xxxxxxx' host: '10.55.67.34' (Got an error reading communication packets)."

## Notifications

Notifications can be distributed via email (using SNS), or notifications can be sent to a Slack channel.

See the next section for details on how to configure where notifications are sent.

## Configuration

Settings are managed in the `config` file which is sourced by the `deploy` script.

**Notification Topic Name**

Set the `NOTIFICATION_TOPIC_NAME` to configure notifications to be sent to an SNS topic.

**Slack Webhook Url**

Set the `SLACK_WEBHOOK_URL` to configure notifications to be sent to Slack.

**Slack Channel**

Set the `SLACK_CHANNEL` variable to configure what Slack channel notifications are delivered to.

**Log Monitoring Interval**

`LOG_MONITORING_INTERVAL` configures how often the RDS logs are polled for changes.

**Event Filtering**

Ignore events by adding the event ID to `FILTER_EVENTS_LIST`. See http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html for a list of event IDs.

**Log Filtering**

Specify a value for `FILTER_LOGS_REGEX` to ignore log messages that are of no interest to you.

## Deploy

```
export AWS_PROFILE=vhl-staging
export AWS_DEFAULT_REGION=us-east-1
./deploy.sh
```

## Notes

**MySQL error Logging**

```
The MySQL error log is written to the mysql-error.log file. You can view mysql-error.log by using the Amazon RDS console or by retrieving the log using the Amazon RDS API, Amazon RDS CLI, or AWS SDKs. mysql-error.log is flushed every 5 minutes, and its contents are appended to mysql-error-running.log. The mysql-error-running.log file is then rotated every hour and the hourly files generated during the last 24 hours are retained. Each log file has the hour it was generated (in UTC) appended to its name. The log files also have a timestamp that helps you determine when the log entries were written.
```

**Postgres error logging**

```
RDS PostgreSQL generates query and error logs. We write auto-vacuum info and rds_admin actions to the error log. Postgres also logs connections/disconnections/checkpoints to the error log.
```
