'use strict';

const aws = require('aws-sdk');
const SlackWebHook = require('@slack/client').IncomingWebhook;

const DEBUG = process.env.DEBUG == "true";
const NOTIFICATION_TOPIC = process.env.NOTIFICATION_TOPIC;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

exports.send = function(subject, message) {
  if(NOTIFICATION_TOPIC) {
    let params = {
      Message: JSON.stringify(message, null, '  '),
      Subject: "[RDS Monitoring] " + subject,
      TopicArn: NOTIFICATION_TOPIC
    };

    if(DEBUG) {
      console.log(params);
    }

    let snsClient = new aws.SNS();
    snsClient.publish(params, function(err, data) {
      if(err) {
        console.log("Failed to send SNS notification:", err, err.stack);
      }
    });
  }
  else if(SLACK_WEBHOOK_URL) {
    let attachment_fields = []
    for(var key in message) {
      if(message.hasOwnProperty(key)) {
        attachment_fields.push({
          title: key,
          value: message[key],
          short: ['Event Source', 'Event Time', 'Source ID'].includes(key)
        });
      }
    }

    let params = {
      username: 'RDSMon',
      iconEmoji: ':robot_face:',
      channel: SLACK_CHANNEL,
      text: subject,
      attachments: [{
        fields: attachment_fields
      }]
    };

    if(DEBUG) {
      console.log(params);
      console.log(attachment_fields);
    }

    let webhook = new SlackWebHook(SLACK_WEBHOOK_URL);
    webhook.send(params, function(err, res) {
      if(err) {
        console.log("Error:", err);
      }
    });
  }
  else {
    console.log(subject, message);
  }
};
