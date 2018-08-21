const ABI = require('ethereumjs-abi')

const Subscriber = artifacts.require('Subscriber.sol')
const Emitter = artifacts.require('Emitter.sol')
const Registry = artifacts.require('Registry.sol')

contract('Subscriber', async () => {
  let instance
  let emitter
  let registry
  let eventId

  before(async () => {
    instance = await Subscriber.deployed()
    emitter = await Emitter.deployed()
    registry = await Registry.deployed()
  })

  it('should have default value', async () => {
    let val = await instance.value()
    assert.equal(val, '0')
  })

  it('should set new value', async () => {
    await instance.setValue(5)
    let val = await instance.value()

    assert.equal(val, '5')
  })

  it('should set new values', async () => {
    let hex = web3.sha3('test')

    await instance.setValues(6, hex)
    let val = await instance.value()
    let text = await instance.text()

    assert.equal(val, '6')
    assert.equal(text, hex)
  })

  it('should subscribe', async () => {
    let method = web3.sha3('setValue(uint256)')
    await instance.subscribe(emitter.address, 'Transfer', method)
    eventId = ABI.soliditySHA3(['address', 'bytes32'], [emitter.address, 'Transfer'])
    eventId = '0x' + eventId.toString('hex')
  })

  it('should be invoked', async () => {
    let encoded = ABI.rawEncode(['uint256'], [22])
    encoded = '0x' + encoded.toString('hex')

    await registry.invoke(eventId, instance.address, encoded)

    let value = await instance.value()
    assert.equal(value, '22')
  })
})
