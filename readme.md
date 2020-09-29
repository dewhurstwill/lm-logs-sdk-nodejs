# lm-logs-sdk-nodejs (beta)
NodeJS SDK for sending logs to LogicMonitor

`npm install lm-logs-sdk-node` - if published to npm

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