'use strict';

const aws = require('aws-sdk');
const notifications = require('./notifications.js');
const filter = require('./log-filter.js');

const DEBUG = process.env.DEBUG == "true";
const LOG_MONITORING_INTERVAL = process.env.LOG_MONITORING_INTERVAL;

exports.processLogs = function() {
  var currentTimestamp = Date.now();
  var rdsClient = new aws.RDS();

  var enumerateDBInstanceLogs = function(logCallback) {
    rdsClient.describeDBInstances({}).on('success', function enumerateDBs(response) {
      response.data.DBInstances.forEach(function(dbInstance) {
        let params = {
          DBInstanceIdentifier: dbInstance.DBInstanceIdentifier,
          FilenameContains: 'error',
          FileLastWritten: (currentTimestamp - (LOG_MONITORING_INTERVAL * 60 * 1000))
        };

        if(DEBUG) {
          console.log("Retrieving log files for", dbInstance.DBInstanceIdentifier);
        }

        rdsClient.describeDBLogFiles(params).on('success', function processLogs(response) {
          response.data.DescribeDBLogFiles.forEach(function(logFile) {
            logCallback(logFile, dbInstance);
          });

          if(response.hasNextPage()) {
            response.nextPage().on('success', processLogs).send();
          }
        }).on('error', function(err) {
          throw err
        }).send();
      });

      if(response.hasNextPage()) {
        response.nextPage().on('success', enumerateDBs).send();
      }
    }).on('error', function(err) {
      throw err
    }).send();
  };

  var processLogFile = function(logFile, dbInstance) {
    let dbInstanceId = dbInstance.DBInstanceIdentifier;
    let logFileName = logFile.LogFileName;
    let params = {
      DBInstanceIdentifier: dbInstance.DBInstanceIdentifier,
      LogFileName: logFileName,
      NumberOfLines: 100
    };

    if(DEBUG) {
      console.log("Processing log file", logFileName, "for db instance", dbInstanceId);
    }

    rdsClient.downloadDBLogFilePortion(params).on('success', function processLogLines(response) {
      let partialLogData = filter.filter(response.data.LogFileData, logFile, dbInstance);
      if(partialLogData) {
        let subject = "Log alert for " + dbInstanceId;
        let message = {
          Database: dbInstanceId,
          LogFile: logFileName,
          Link: "https://console.aws.amazon.com/rds/home#dbinstance:id=" + dbInstanceId + ";view=logs",
          LogData: partialLogData + "\n" + "NOTE: This message only contains 100 of the most recent log messages."
        }
        notifications.send(subject, message);
      }
    }).on('error', function(err) {
      throw err;
    }).send();
  };

  enumerateDBInstanceLogs(processLogFile);
};
