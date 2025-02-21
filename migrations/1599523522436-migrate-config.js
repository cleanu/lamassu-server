const db = require('./db')
const machineLoader = require('../lib/machine-loader')
const { saveConfig, saveAccounts, loadLatest } = require('../lib/new-settings-loader')
const { migrate } = require('../lib/config-migration')

const _ = require('lodash/fp')

const OLD_SETTINGS_LOADER_SCHEMA_VERSION = 1

module.exports.up = function (next) {
  function migrateConfig (settings) {
    const newSettings = migrate(settings.config, settings.accounts)
    return Promise.all([
      saveConfig(newSettings.config),
      saveAccounts(newSettings.accounts)
    ])
      .then(() => next())
  }

  loadLatest(OLD_SETTINGS_LOADER_SCHEMA_VERSION)
    .then(async settings => {
      if (_.isEmpty(settings.config)) {
        return {
          settings,
          machines: []
        }
      }
      return {
        settings,
        machines: await machineLoader.getMachineNames(settings.config)
      }
    })
    .then(({ settings, machines }) => {
      if (_.isEmpty(settings.config)) {
        return next()
      }
      const sql = machines
        ? machines.map(m => `update devices set name = '${m.name}' where device_id = '${m.deviceId}'`)
        : []
      return db.multi(sql, () => migrateConfig(settings))
    })
    .catch(err => {
      if (err.message === 'lamassu-server is not configured') {
        return next()
      }
      console.log(err.message)
      return next(err)
    })
}

module.exports.down = function (next) {
  next()
}
