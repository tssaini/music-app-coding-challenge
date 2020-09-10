const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    // change level if in dev environment versus production
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),

    ),
    transports: [
        new transports.Console({
            levels: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
                ),
            ),
        })
    ],
    exitOnError: false,
});
logger.stream = {
    write: (message) => {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};
module.exports = logger;
