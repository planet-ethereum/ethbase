const Sample = artifacts.require('Sample.sol')

contract('Sample', async () => {
  it('should have default value', async () => {
    let instance = await Sample.deployed()

    let val = await instance.value()
    assert.equal(val, '0')
  })

  it('should set new value', async () => {
    let instance = await Sample.deployed()

    await instance.setValue(5)
    let val = await instance.value()

    assert.equal(val, '5')
  })

  it('should set new values', async () => {
    let instance = await Sample.deployed()
    let hex = web3.sha3('test')

    await instance.setValues(6, hex)
    let val = await instance.value()
    let text = await instance.text()

    assert.equal(val, '6')
    assert.equal(text, hex)
  })
})
