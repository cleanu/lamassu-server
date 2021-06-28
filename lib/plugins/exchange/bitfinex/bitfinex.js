const { Bitfinex, PAIRS } = require('../../common/bitfinex')
const _ = require('lodash/fp')
const coinUtils = require('../../../coin-utils')

module.exports = {buy, sell}


function buy (account, cryptoAtoms, fiatCode, cryptoCode) {
    return trade(account, 'buy', cryptoAtoms, fiatCode, cryptoCode)
}
  
function sell (account, cryptoAtoms, fiatCode, cryptoCode) {
    return trade(account, 'sell', cryptoAtoms, fiatCode, cryptoCode)
}

function trade (account, type, cryptoAtoms, fiatCode, cryptoCode) {
    const bitfinex = new Bitfinex(account.apiKey, account.secretKey)
    var amount = coinUtils.toUnit(cryptoAtoms, cryptoCode)
    if (type == 'sell')
        amount *= -1
    const amountStr = amount.toFixed(6)
  
    const pair = PAIRS[cryptoCode][fiatCode]
  
    var orderInfo = {
                        type: 'market',
                        symbol: pair,
                        amount: amountStr,
                    }
  
    return bitfinex.addOrder(orderInfo)
                   .then(res => {
                       console.log(res)
                       return true
                   })
  }