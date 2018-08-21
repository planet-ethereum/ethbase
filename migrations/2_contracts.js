const Subscriber = artifacts.require("./example/Subscriber.sol");
const Emitter = artifacts.require("./example/Emitter.sol");
const Registry = artifacts.require("./Registry.sol");

module.exports = function(deployer) {
  deployer.deploy(Emitter);
  deployer.deploy(Registry).then((instance) => {
    return deployer.deploy(Subscriber, instance.address);
  })
};
