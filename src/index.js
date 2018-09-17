// Copyright 2018 Vista Higher Learning, Inc.
// Copyright 2018 Jesse Cotton <jcotton@bitlancer.com>
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You
// may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.

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
