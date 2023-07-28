const { createLogger, transports, format } = require('winston');
const { time } = require('./helpers');

// levels: error, warn, info, verbose, debug, silly

const logger = createLogger({
  format: format.printf((info) => `[${time(new Date())}, ${info.level}] - ${info.message}`),
  transports: [
    new transports.Console({ level: 'silly' }),
    new transports.File({
      level: 'info',
      filename: 'app.log',
      dirname: `${__dirname}${process.env.IS_DEV ? '' : '/../../'}`,
    }),
  ],
});

module.exports = logger;
