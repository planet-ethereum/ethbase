const PatriciaTrie = artifacts.require('./lib/PatriciaTrie.sol')
const Verifier = artifacts.require('./Verifier.sol')

module.exports = function (deployer) {
  deployer.deploy(PatriciaTrie)
  deployer.link(PatriciaTrie, Verifier)
  deployer.deploy(Verifier)
}
