const axios = require('axios')
const crypto = require('crypto')

const PAIRS = {
  BTC: {
    USD: 'tBTCUSD',
  },
  ETH: {
    USD: 'tETHUSD',
  },
  ZEC: {
    USD: 'tZECUSD',
  },
  LTC: {
    USD: 'XLTCZUSD',
  },
  BCH: {
    USD: 'tBCHN:USD',
  }
}


class Bitfinex {
  constructor({apiKey, apiSecret}) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }

  fetch = (endpoint, body) => {
    const nonce = (Date.now() * 10000000).toString()
    const signature = `/api/${endpoint}${nonce}${JSON.stringify(body)}` 

    const sig = crypto.createHmac('sha384', this.apiSecret)
                      .update(signature)
                      .digest('hex')

    const config = {
                    headers: {
                      'Content-Type': 'application/json',
                      'bfx-nonce': nonce,
                      'bfx-apikey': this.apiKey,
                      'bfx-signature': sig
                    }
                  } 

    return axios.post(`https://api.bitfinex.com/${endpoint}`, body, config)
                .then(res => res.data)
  }

  addOrder = (body) => {
    return this.fetch('v2/auth/w/order/submit', body)
               .then(res => res)
               .catch(error => {console.log(error); return error})
  }

  getWallet = () => {
    return this.fetch('v2/auth/r/wallets', {})
               .then(res => res)
               .catch(error => {
                 console.log(error)
               })
  }
}

// function test() {
//   console.log('hihi')
//   const bitfinex = new Bitfinex({apiKey: 'yKxf7Kpj7kGBm5Ql5iffxpOXOxPcaK05061lqrsTtYM', apiSecret: 'X3Q4YOPXrve9ya7u3OHtojvAtpRHag6XnLYX42amg9B'})
//   bitfinex.getWallet().then(res => console.log(res))
// }

// test()
  
module.exports = { PAIRS, Bitfinex }
