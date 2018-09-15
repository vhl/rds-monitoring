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
