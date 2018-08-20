const Sample = artifacts.require("./Sample.sol");
const Registry = artifacts.require("./Registry.sol");

module.exports = function(deployer) {
  deployer.deploy(Sample);
  deployer.deploy(Registry);
};
