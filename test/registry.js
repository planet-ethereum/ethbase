const Registry = artifacts.require('Registry.sol')
const Sample = artifacts.require('Sample.sol')

contract('Registry', async () => {
  it('should register event', async () => {
    let instance = await Registry.deployed()
    let sample = await Sample.deployed()
    let hex = web3.sha3('setRandomValue()')

    await instance.register('Transfer', sample.address, hex)
  })

  it('should invoke', async () => {
    let instance = await Registry.deployed()
    let sample = await Sample.deployed()

    await instance.invoke('Transfer')

    let val = await sample.value()
    assert.equal(val, '21')
  })
})
