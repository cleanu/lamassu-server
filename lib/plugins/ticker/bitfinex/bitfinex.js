const axios = require('axios')
const _ = require('lodash/fp')

const BN = require('../../../bn')
const { PAIRS } = require('../../common/bitfinex')

exports.NAME = 'Bitfinex'
exports.SUPPORTED_MODULES = ['ticker']

function findCurrency(fxRates, fiatCode) {
    const rates = _.find(_.matchesProperty('code', fiatCode), fxRates)
    if (!rates || !rates.rate) throw new Error(`Unsupported currency: ${fiatCode}`)
    return BN(rates.rate.toString())
}

exports.ticker = function ticker(account, fiatCode, cryptoCode) {
    if (fiatCode === 'USD') {
        return getCurrencyRates(fiatCode, cryptoCode)
    }


    // get currency rate
    return axios.get('https://bitpay.com/api/rates')
        .then(response => {
            const fxRates = response.data
            const usdRate = findCurrency(fxRates, 'USD')
            const fxRate = findCurrency(fxRates, fiatCode).div(usdRate)

            return getCurrencyRates('USD', cryptoCode)
                .then(res => ({
                    rates: {
                        ask: res.rates.ask.times(fxRate),
                        bid: res.rates.bid.times(fxRate)
                    }
                }))
        })
}

function getCurrencyRates(fiatCode, cryptoCode) {
    const pair = PAIRS[cryptoCode][fiatCode]
    // console.log(pair)
    return axios.get('https://api-pub.bitfinex.com/v2/ticker/' + pair)
        .then(function (response) {
            const [bid, bidSize, ask, askSize, dailyChange, dailyChangeRelative, lastPrice, volume, high, low] = response.data
            return {
                rates: {
                    ask: BN(ask),
                    bid: BN(bid)
                }
            }
        })
}
