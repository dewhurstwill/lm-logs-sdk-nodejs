// Node Modules
const https = require('https');
const crypto = require('crypto');

const validateEnvironmentVariables = (source) => {
  // Array of logger required keys
  const loggerRequiredKeys = [
    'TARGET_PROPERTY',
    'TARGET_VALUE'
  ];

  // Array of required keys
  const requiredKeys = [
    'COMPANY_NAME',
    'ACCESS_ID',
    'ACCESS_KEY',
    ...(source === 'logger') ? loggerRequiredKeys : []
  ];

  // Filter environment variables to check if all required keys are present
  const unsetKeys = requiredKeys.filter((key) => ((typeof process.env[key] === 'undefined') || process.env[key]));

  // Throw an error if there are any unset required keys
  if (unsetKeys.length > 0) throw new Error(`Required environment variables are not set: [${unsetKeys.join(', ')}]`);
};

const generateToken = (events) => {
  // Deconstructing environment variables object to pull Access ID & Access Key
  const {
    ACCESS_ID,
    ACCESS_KEY
  } = process.env;

  // Generate Epoch Timestamp
  const timestamp = new Date().getTime();

  // Log ingest API path
  const resourcePath = '/log/ingest';

  // Log ingest API verb
  const httpVerb = 'POST';

  // Create a hex using the access key timestamp, HTTP verb, resource path and events data
  const hex = crypto.createHmac('sha256', ACCESS_KEY)
    .update(`${httpVerb}${timestamp}${JSON.stringify(events)}${resourcePath}`)
    .digest('hex');

  // Create base64 string signature from hex
  const signature = Buffer.from(hex).toString('base64');

  // Construct the access token
  const token = `LMv1 ${ACCESS_ID}:${signature}:${timestamp}`;

  // Return the token
  return token;
};

const sendLogs = (events) => {
  // Check if events is an array
  if (!Array.isArray(events)) throw new Error('Events must be an array');

  // Check if events array is empty
  if (events.length === 0) throw new Error('Events cannot be an empty array');

  // Deconstructing environment variables object to pull Company Name
  const {
    COMPANY_NAME
  } = process.env;

  // Stringify events array ready for the request
  const data = JSON.stringify(events);

  // HTTP Request Options
  const options = {
    hostname: `${COMPANY_NAME}.logicmonitor.com`,
    port: 443,
    path: '/rest/log/ingest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      authorization: generateToken(events)
    }
  };

  // Make the request
  const req = https.request(options, (res) => {
    // If LOG_LEVEL is set to DEBUG show API responses in the console
    if (process.env.LOG_LEVEL === 'DEBUG') {
      // eslint-disable-next-line no-console
      console.log(`Shipping message: ${data}......`);
      // Console log request status code e.g. 200, 202, 400, 500
      // eslint-disable-next-line no-console
      console.log(`statusCode: ${res.statusCode}`);
      // Console log the response data
      res.on('data', (d) => process.stdout.write(d));
    }
  });

  // Throw an error on api request fail
  // eslint-disable-next-line no-console
  req.on('error', (error) => console.error(error));
  req.write(data);
  req.end();
};

const logger = (message) => {
  if (!message) throw new Error('Logger requires a message'); // Ensure logger has a message and isn't tring to send a null message
  validateEnvironmentVariables('logger'); // Check the correct environment variables are set

  // Deconstructing environment variables object to pull target property and value
  const {
    TARGET_PROPERTY,
    TARGET_VALUE
  } = process.env;

  let messageString = message;

  if (typeof message !== 'string') {
    if (typeof message === 'object') {
      // If message is not a string but is an object, stringify the object
      messageString = JSON.stringify(message);
    } else {
      // If the message is not a string or an object wrap it into a string
      messageString = `${message}`;
    }
  }

  // Construct the log to ingest
  const log = [{
    message: messageString,
    '_lm.resourceId': {
      [TARGET_PROPERTY]: TARGET_VALUE
    }
  }];

  // Send log to Logicmonitor
  sendLogs(log);
};

const ingest = (logs) => {
  validateEnvironmentVariables();
  // Send logs to Logicmonitor
  sendLogs(logs);
};

exports.logger = logger;
exports.ingest = ingest;
