const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function smNgLintWithTolerance() {
  console.log('Starting ng lint:');
  const allowedErrors = 90;

  let lintResults;
  try {
    lintResults = await exec('ng lint');
  } catch (e) {
    const errors = e.stdout.split('\n');
    const problemMessage = errors.reverse().find(x => x.includes("problems"));
    const errorCount = problemMessage.split(' ')[1];
    console.log(`${errorCount} linting errors detected; ${allowedErrors} errors allowed.`);
    if (errorCount > allowedErrors) {
      console.log('linting failed')
      process.exit(1);
    } else {
      console.log('linting passed')
      process.exit(0)
    }
  }
  console.log(lintResults);
  process.exit(0);
}

// noinspection JSIgnoredPromiseFromCall
smNgLintWithTolerance();
