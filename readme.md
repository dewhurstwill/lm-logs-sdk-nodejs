# [unofficial] lm-logs-sdk-nodejs (beta)
NodeJS SDK for sending logs to LogicMonitor

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=ncloc)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=bugs)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=security_rating)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=sqale_index)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=dewhurstwill_lm-logs-sdk-nodejs&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=dewhurstwill_lm-logs-sdk-nodejs)

`npm install lm-logs-sdk-node` - if/when published to npm

## Ingest:

### Required Environment Variables: 
- COMPANY_NAME
- ACCESS_ID
- ACCESS_KEY

``` javascript
const { ingest } = require("lm-logs-sdk-node");

logs = [{
    "message": "Hello! from Logic Monitor",
    "_lm.resourceId": {
        "<lm_property>" => "<lm_property_value>"
    }
}]

ingest(logs);

```

## Logger:

### Required Environment Variables: 
- COMPANY_NAME
- ACCESS_ID
- ACCESS_KEY
- TARGET_PROPERTY (e.g. system.deviceId)
- TARGET_VALUE (e.g. "123")

### Example:

``` javascript
const { logger } = require("lm-logs-sdk-node");

logger("Hello! from Logic Monitor");

 // Log message would be a stringified version
logger(["Hello", "From", "Logic", "Monitor"]);
logger({ "Hello From": "Logic Monitor" });

```
