const RelayNetwork = artifacts.require('RelayNetwork')

contract('RelayNetwork', async (accounts) => {
  let instance

  before(async () => {
    instance = await RelayNetwork.new()
  })

  it('should have no relayers initially', async () => {
    let relayersCount = await instance.relayersCount.call()
    assert.equal(relayersCount, 0)
  })
})
