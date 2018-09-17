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
