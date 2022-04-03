import yargs from 'yargs';
import path from 'path';
import { hideBin } from 'yargs/helpers';
import ensureLinks from './ensureLinks';
import logger from './logger';


(async() => {
  const argv = await yargs(hideBin(process.argv))
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
    })
    .option('lib', {
        alias: 'l',
        type: 'string',
        description: 'Directory to bind'
    })
    .option('cwd', {
      alias: 'c',
      type: 'string',
      description: 'Directory to where the modules is located'
    })
    .option('no-workspace', {
      type: 'boolean',
      description: 'Apply links if workspace if present',
    })
    .parse();

  const cwd = argv.cwd ? path.resolve(argv.cwd) : process.cwd();

  if (argv.verbose) {
    logger.enableVerbose();
  }

  ensureLinks({
    logger,
    cwd,
    workspace: argv.workspace as boolean,
    lib: argv.lib
  });

})();


