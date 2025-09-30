module.exports = {
  default: {
    paths: ['src/test/resources/features/**/*.feature'],
    require: ['src/test/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    publishQuiet: true
  }
};