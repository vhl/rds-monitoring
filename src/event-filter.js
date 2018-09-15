'use strict';

const FILTER_EVENTS_LIST = process.env.FILTER_EVENTS_LIST;

exports.ignoreEvent = function(event) {
  if(event['Event Source'] != 'db-instance') {
    return true;
  }

  if(FILTER_EVENTS_LIST) {
    let filterEvents = FILTER_EVENTS_LIST.split(',');
    let eventId = event['Event ID'].split('#')[1];
    return filterEvents.includes(eventId);
  }

  return false;
};
