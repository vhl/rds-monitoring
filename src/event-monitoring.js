'use strict';

const notifications = require('./notifications.js');
const filter = require('./event-filter.js');

const DEBUG = process.env.DEBUG == "true";

exports.processEvent = function(event) {
  if(DEBUG) {
    console.log("Processing event:", event);
  }

  if(filter.ignoreEvent(event)) {
    if(DEBUG) {
      console.log("Ignoring event:", event);
    }
    return;
  }

  let sourceId = event['Source ID'];
  let subject = "Event Alert for " + sourceId;
  let message = event;

  notifications.send(subject, message);
};
