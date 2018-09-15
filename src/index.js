'use strict';

const logMonitoring = require('./log-monitoring.js');
const eventMonitoring = require('./event-monitoring.js');

const DEBUG = process.env.DEBUG == "true";

exports.handler = function(event, context, callback) {
  if(DEBUG) {
    console.log("Received event:", event);
  }

  let events = [];
  if(event.Records) {
    events = event.Records;
  }
  else {
    events = [event];
  }

  events.forEach(function(e) {
    try {
      if(e.source && e.source == "aws.events") {
        logMonitoring.processLogs();
      }
      else if(e.EventSource && e.EventSource == "aws:sns") {
        let message = JSON.parse(e.Sns.Message);
        eventMonitoring.processEvent(message);
      }
      else {
        console.log("Encountered an unexpected event:", e)
      }
    }
    catch(err) {
      console.log("Fatal error:", err, err.stack);
    }
  });
};
