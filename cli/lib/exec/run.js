const _ = require('lodash')

const downloadUtils = require('../download/utils')
const spawn = require('./spawn')
const path = require('path')
const packagePath = path.join(__dirname, '..', '..', 'package.json')
const pkg = require(packagePath)

const processRunOptions = (options = {}) => {
  const args = ['--run-project', options.project]

  //// if key is set use that - else attempt to find it by env var
  if (options.key == null) {
    options.key = process.env.CYPRESS_RECORD_KEY || process.env.CYPRESS_CI_KEY
  }

  if (options.env) {
    args.push('--env', options.env)
  }

  if (options.config) {
    args.push('--config', options.config)
  }

  if (options.port) {
    args.push('--port', options.port)
  }

  //// if we have a specific spec push that into the args
  if (options.spec) {
    args.push('--spec', options.spec)
  }

  //// if we have a specific reporter push that into the args
  if (options.reporter) {
    args.push('--reporter', options.reporter)
  }

  //// if we have a specific reporter push that into the args
  if (options.reporterOptions) {
    args.push('--reporter-options', options.reporterOptions)
  }

  if (options.ci) {
    //// push to display the deprecation message
    args.push('--ci')

    //// also automatically record
    args.push('--record', true)
  }

  //// if we have a key assume we're in record mode
  if (options.key) {
    args.push('--key', options.key)
  }

  //// if record is defined and we're not
  //// already in ci mode, then send it up
  if (options.record != null && !options.ci) {
    args.push('--record', options.record)
  }

  if (options.outputPath) {
    args.push('--output-path', options.outputPath)
  }

  //// send in the CLI version
  args.push('--cli-version', pkg.version)

  if (options.browser) {
    args.push('--browser', options.browser)
  }

  return args
}

const run = (options) => () => {
  const args = processRunOptions(options)
  return spawn.start(args)
}

module.exports = {
  processRunOptions,
  start (options = {}) {
    _.defaults(options, {
      key: null,
      spec: null,
      reporter: null,
      reporterOptions: null,
      project: process.cwd(),
    })

    return downloadUtils.verify()
    .then(run(options))
  },
}