const Subscriber = artifacts.require('Subscriber.sol')

contract('Subscriber', async () => {
  let instance

  before(async () => {
    instance = await Subscriber.deployed()
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
})
