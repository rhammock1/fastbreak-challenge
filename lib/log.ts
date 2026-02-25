const {LOG_LEVEL = 'info'} = process.env;

const LOG_LEVELS = {
  off: 99,
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
};
const ENV_LOG_LEVEL = LOG_LEVELS[LOG_LEVEL as keyof typeof LOG_LEVELS];

const getMessage = (level: keyof typeof LOG_LEVELS, params: unknown[]) => {
  let message = `${level.toUpperCase()}:`;
  
  params.forEach((param) => {
    if(typeof param === 'object') {
      message += JSON.stringify(param);
    } else if(param instanceof Error) {
      message += `${param.name}: ${param.message}\n${param.stack}`;
    } else {
      message += param;
    }
  });

  return message;
};

export const log = (level: keyof typeof LOG_LEVELS, ...params: unknown[]) => {
  if(LOG_LEVELS[level] < ENV_LOG_LEVEL) return;

  const message = getMessage(level, params);
  
  console.log(message);
};
