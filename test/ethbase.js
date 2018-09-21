/* global web3 */
const Ethbase = artifacts.require('Ethbase.sol')
const Subscriber = artifacts.require('Subscriber.sol')
const Emitter = artifacts.require('Emitter.sol')

let emitter

before(async () => {
  emitter = await Emitter.deployed()
})

contract('Ethbase: sub/unsub', async () => {
  let instance
  let subscriber
  let eventId

  before(async () => {
    instance = await Ethbase.deployed()
    subscriber = await Subscriber.deployed()
  })

  it('should revert if not subscribed', async () => {
    let topic = web3.sha3('Transfer(uint256)')
    let id = web3.sha3(emitter.address, topic)
    try {
      await instance.submitLog('0x0', '0x0', '0x0', 0, '0x0', subscriber.address, id)
      assert.fail('Expected revert not received')
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }
  })

  it('should subscribe to an event', async () => {
    let topic = web3.sha3('Transfer(uint256)')
    let method = web3.sha3('setRandomValue()')
    const tx = await instance.subscribe(emitter.address, topic, subscriber.address, method)
    eventId = tx.logs[0].args.eventId
  })

  it('should unsubscribe', async () => {
    await instance.unsubscribe(eventId, subscriber.address)
  })

  it('should revert for unsubscribed event', async () => {
    try {
      await instance.submitLog('0x0', '0x0', '0x0', 0, '0x0', subscriber.address, eventId)
      assert.fail('Expected revert not received')
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }
  })
})

contract('Ethbase: multiple subscribers', async () => {
  let instance
  let sub1
  let sub2
  let eventId

  before(async () => {
    instance = await Ethbase.deployed()
    sub1 = await Subscriber.deployed()
    sub2 = await Subscriber.new(instance.address)
  })

  it('should subscribe both contracts', async () => {
    let topic = web3.sha3('Transfer(uint256)')
    let method = web3.sha3('setValue(uint256)')

    let tx = await instance.subscribe(emitter.address, topic, sub1.address, method)
    eventId = tx.logs[0].args.eventId

    tx = await instance.subscribe(emitter.address, topic, sub2.address, method)
    assert.equal(tx.logs[0].args.eventId, eventId)
  })
})
