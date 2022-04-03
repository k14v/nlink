import debug from 'debug';

const logger = debug('nlink');

debug.enable('nlink,nlink:info');

export default Object.assign(logger, {
  info: logger.extend('info'),
  silly: logger.extend('silly'),
  enableVerbose: () => {
    debug.enable('nlink*');
  }
});
