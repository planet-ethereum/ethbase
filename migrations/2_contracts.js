const Subscriber = artifacts.require('./example/Subscriber.sol')
const Emitter = artifacts.require('./example/Emitter.sol')
const Ethbase = artifacts.require('./Ethbase.sol')
const PatriciaTrie = artifacts.require('./lib/PatriciaTrie.sol')
const Receipt = artifacts.require('./Receipt')
const Block = artifacts.require('./Block')

module.exports = function (deployer) {
  deployer.deploy(Receipt)
  deployer.deploy(Block)
  deployer.deploy(PatriciaTrie)
  deployer.deploy(Emitter)
  deployer.link(Receipt, Ethbase)
  deployer.link(Block, Ethbase)
  deployer.link(PatriciaTrie, Ethbase)
  deployer.deploy(Ethbase).then((instance) => {
    return deployer.deploy(Subscriber, instance.address)
  })
}
