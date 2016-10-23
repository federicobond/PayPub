const bitcore = require('bitcore-lib')
const { Insight } = require('bitcore-explorers')

Insight.prototype.sync = function(callback) {
  this.requestGet('/api/sync', function(err, res, body) {
    if (err || res.statusCode !== 200) {
      return callback(err || body)
    }
    return callback(null, JSON.parse(body))
  })
}

Insight.prototype.addressTxs = function(address, callback) {
  this.requestGet('/api/txs?address=' + address, function(err, res, body) {
    if (err || res.statusCode !== 200) {
      return callback(err || body)
    }
    return callback(null, JSON.parse(body))
  })
}
module.exports = new Insight('https://test-insight.bitpay.com', bitcore.Networks.testnet)
