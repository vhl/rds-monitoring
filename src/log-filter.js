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

const FILTER_LOGS_REGEX = process.env.FILTER_LOGS_REGEX;

exports.filter = function(logData, logFile, dbInstance) {
  if(!['mysql', 'mariadb'].includes(dbInstance.Engine)) {
    return false;
  }
  if(logFile.LogFileName != 'error/mysql-error-running.log') {
    return false;
  }

  if(FILTER_LOGS_REGEX) {
    let filterLogsRegex = new RegExp(FILTER_LOGS_REGEX);
    let logLines = logData.trim().split("\n");
    for(var i = logLines.length - 1; i >= 0; i--) {
      if(logLines[i].match(filterLogsRegex)) {
        logLines.splice(i, 1);
      }
    }
    return logLines.join("\n");
  }
  else {
    return logData;
  }
};
