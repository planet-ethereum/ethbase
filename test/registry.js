const ABI = require('ethereumjs-abi')

const Registry = artifacts.require('Registry.sol')
const Sample = artifacts.require('Sample.sol')

contract('Registry: invoke without args', async () => {
  let instance
  let sample

  before(async () => {
    instance = await Registry.deployed()
    sample = await Sample.deployed()
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setRandomValue()')
    await instance.subscribe('Transfer', sample.address, hex)
  })

  it('should invoke', async () => {
    await instance.invoke('Transfer', 0)
    let val = await sample.value()

    assert.equal(val, '21')
  })
})

contract('Registry: invoke with arg', async () => {
  let instance
  let sample

  before(async () => {
    instance = await Registry.deployed()
    sample = await Sample.deployed()
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setValue(uint256)')
    await instance.subscribe('Transfer', sample.address, hex)
  })

  it('should invoke', async () => {
    let encoded = ABI.rawEncode(['uint256'], [22])
    encoded = '0x' + encoded.toString('hex')

    await instance.invoke('Transfer', encoded)

    let val = await sample.value()
    assert.equal(val, '22')
  })
})

contract('Registry: invoke with multiple args', async () => {
  let instance
  let sample

  before(async () => {
    instance = await Registry.deployed()
    sample = await Sample.deployed()
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setValues(uint256,bytes32)')
    await instance.subscribe('Transfer', sample.address, hex)
  })

  it('should invoke', async () => {
    let hex = web3.fromAscii('test')
    let encoded = ABI.rawEncode(['uint256', 'bytes32'], [25, hex])
    encoded = '0x' + encoded.toString('hex')

    await instance.invoke('Transfer', encoded)

    let val = await sample.value()
    let text = await sample.text()
    assert.equal(val, '25')
    assert.equal(web3.toAscii(text).replace(/\u0000/g, ''), 'test')
  })
})

contract('Registry: sub/unsub', async () => {
  let instance
  let sample

  before(async () => {
    instance = await Registry.deployed()
    sample = await Sample.deployed()
  })

  it('should revert if not subscribed', async () => {
    try {
      await instance.invoke('Transfer', 0)
      assert.fail('Expected revert not received')
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }
  })

  it('should subscribe to an event', async () => {
    let hex = web3.sha3('setRandomValue()')
    await instance.subscribe('Transfer', sample.address, hex)
  })

  it('should invoke', async () => {
    await instance.invoke('Transfer', 0)
  })

  it('should unsubscribe', async () => {
    await instance.unsubscribe('Transfer')
  })

  it('should revert for unsubscribed event', async () => {
    try {
      await instance.invoke('Transfer', 0)
      assert.fail('Expected revert not received')
    } catch (e) {
      const revertFound = e.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${e} instead`)
    }
  })
})
