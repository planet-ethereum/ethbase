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
})
