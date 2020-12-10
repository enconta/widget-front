const path = require('path')

module.exports = {
  utils: path.resolve(__dirname, 'src/utils/'),
  api: path.resolve(__dirname, 'src/api/'),
  actions: path.resolve(__dirname, 'src/actions/'),
  stores: path.resolve(__dirname, 'src/stores/'),
  shared: path.resolve(__dirname, 'src/components/app/shared'),
  appsignal: path.resolve(__dirname, 'src/appSignal/'),
  test: path.resolve(__dirname, 'src/test/')
}
