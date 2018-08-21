const ABI = require('ethereumjs-abi')

const Registry = artifacts.require('Registry.sol')
const Subscriber = artifacts.require('Subscriber.sol')
const Emitter = artifacts.require('Emitter.sol')

let emitter

before(async () => {
  emitter = await Emitter.deployed()
})

contract('Registry: invoke without args', async () => {
  let instance
  let subscriber
  let eventId

  before(async () => {
    instance = await Registry.deployed()
    subscriber = await Subscriber.deployed()
  })

  it('should subscribe to an event', async () => {
    const hex = web3.sha3('setRandomValue()')
    const tx = await instance.subscribe(emitter.address, 'Transfer', subscriber.address, hex)
    eventId = tx.logs[0].args.eventId
  })

  it('should invoke', async () => {
    await instance.invoke(eventId, subscriber.address, 0)
    let val = await subscriber.value()

    assert.equal(val, '21')
  })
})

contract('Registry: invoke with arg', async () => {
  let instance
  let subscriber
  let eventId

  before(async () => {
    instance = await Registry.deployed()
    subscriber = await Subscriber.deployed()
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setValue(uint256)')
    const tx = await instance.subscribe(emitter.address, 'Transfer', subscriber.address, hex)
    eventId = tx.logs[0].args.eventId
  })

  it('should invoke', async () => {
    let encoded = ABI.rawEncode(['uint256'], [22])
    encoded = '0x' + encoded.toString('hex')

    await instance.invoke(eventId, subscriber.address, encoded)

    let val = await subscriber.value()
    assert.equal(val, '22')
  })
})

contract('Registry: invoke with multiple args', async () => {
  let instance
  let subscriber
  let eventId

  before(async () => {
    instance = await Registry.deployed()
    subscriber = await Subscriber.deployed()
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setValues(uint256,bytes32)')
    const tx = await instance.subscribe(emitter.address, 'Transfer', subscriber.address, hex)
    eventId = tx.logs[0].args.eventId
  })

  it('should invoke', async () => {
    let hex = web3.fromAscii('test')
    let encoded = ABI.rawEncode(['uint256', 'bytes32'], [25, hex])
    encoded = '0x' + encoded.toString('hex')

    await instance.invoke(eventId, subscriber.address, encoded)

    let val = await subscriber.value()
    let text = await subscriber.text()
    assert.equal(val, '25')
    assert.equal(web3.toAscii(text).replace(/\u0000/g, ''), 'test')
  })
})

contract('Registry: sub/unsub', async () => {
  let instance
  let subscriber
  let eventId

  before(async () => {
    instance = await Registry.deployed()
    subscriber = await Subscriber.deployed()
  })

  it('should revert if not subscribed', async () => {
    let id = web3.sha3(emitter.address, 'Transfer')
    try {
      await instance.invoke(id, subscriber.address, 0)
      assert.fail('Expected revert not received')
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setRandomValue()')
    const tx = await instance.subscribe(emitter.address, 'Transfer', subscriber.address, hex)
    eventId = tx.logs[0].args.eventId
  })

  it('should invoke', async () => {
    await instance.invoke(eventId, subscriber.address, 0)
  })

  it('should unsubscribe', async () => {
    await instance.unsubscribe(eventId, subscriber.address)
  })

  it('should revert for unsubscribed event', async () => {
    try {
      await instance.invoke(eventId, subscriber.address, 0)
      assert.fail('Expected revert not received')
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }
  })
})

contract('Registry: multiple subscribers', async () => {
  let instance
  let sub1
  let sub2
  let eventId

  before(async () => {
    instance = await Registry.deployed()
    sub1 = await Subscriber.deployed()
    sub2 = await Subscriber.new(instance.address)
  })

  it('should subscribe both contracts', async () => {
    let hex = web3.sha3('setValue(uint256)')

    let tx = await instance.subscribe(emitter.address, 'Transfer', sub1.address, hex)
    eventId = tx.logs[0].args.eventId

    tx = await instance.subscribe(emitter.address, 'Transfer', sub2.address, hex)
    assert.equal(tx.logs[0].args.eventId, eventId)
  })

  it('should invoke each contract separately', async () => {
    let encoded = ABI.rawEncode(['uint256'], [10])
    encoded = '0x' + encoded.toString('hex')
    await instance.invoke(eventId, sub1.address, encoded)

    encoded = ABI.rawEncode(['uint256'], [15])
    encoded = '0x' + encoded.toString('hex')
    await instance.invoke(eventId, sub2.address, encoded)

    let v1 = await sub1.value()
    let v2 = await sub2.value()

    assert.equal(v1, '10')
    assert.equal(v2, '15')
  })
})
