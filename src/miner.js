'use strict'

const ABI = require('ethereumjs-abi')

class Miner {
  constructor (web3, registry, account) {
    this.web3 = web3
    this.registry = registry
    this.account = account
  }

  async init () {
    this.registry.Subscribed({
      fromBlock: 0
    }).on('data', async (e) => {
      console.log(e)
    })
  }

  async run () {
    let eventId = ABI.soliditySHA3(['address', 'bytes32'], [this.emitter.address, 'Transfer'])
    eventId = '0x' + eventId.toString('hex')

    this.emitter.Transfer({
      fromBlock: 0
    }).on('data', async (e) => {
      if (e.event !== 'Transfer') {
        return
      }

      let args = ABI.rawEncode(['uint256'], [e.args.amount])
      console.log(args)
      args = '0x' + args.toString('hex')
      let tx = await this.registry.invoke(eventId, this.subscriber.address, args, { from: this.account })
      console.log(tx)
      /*      let val = await subscriber.value()
      if (!val.eq(e.args.amount)) {
        console.error('Subscriber value different than event amount', val, e.args.amount)
      } */
    })
  }
}

module.exports = Miner
