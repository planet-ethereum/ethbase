const PatriciaTrie = artifacts.require('./lib/PatriciaTrie.sol')
const SafeModule = artifacts.require('./SafeModule')
const ProxyFactory = artifacts.require('./ProxyFactory')
const GnosisSafePersonalEdition = artifacts.require('./safe/contracts/GnosisSafePersonalEdition')
const CreateAndAddModules = artifacts.require('./safe/contracts/libraries/CreateAndAddModules')

module.exports = async function (deployer, network, accounts) {
  await deployer.link(PatriciaTrie, SafeModule)

  let proxyFactory = await deployer.deploy(ProxyFactory)
  let createAndAddModules = await deployer.deploy(CreateAndAddModules)
  let safe = await deployer.deploy(GnosisSafePersonalEdition)
  let safeModule = await deployer.deploy(SafeModule)

  let safeModuleSetupData = await safeModule.contract.methods.setup().encodeABI()
  let safeModuleCreationData = await proxyFactory.contract.methods
    .createProxy(safeModule.address, safeModuleSetupData).encodeABI()
  let modulesCreationData = processModulesData([safeModuleCreationData])
  let createAndAddModulesData = await createAndAddModules.contract.methods
    .createAndAddModules(proxyFactory.address, modulesCreationData).encodeABI()

  let gnosisSafeData = await safe.contract.methods
    .setup([accounts[0]], 1, createAndAddModules.address, createAndAddModulesData).encodeABI()
  let tx = await proxyFactory.createProxy(safe.address, gnosisSafeData)
  console.log('SafeModuleProxy: ', tx.logs[0].args.proxy, 'SafeProxy: ', tx.logs[1].args.proxy)
}

// eslint-disable-next-line
const mw = new web3.eth.Contract([{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}])

function processModulesData (dataArray) {
  return dataArray.reduce((acc, data) => acc + mw.methods.setup(data).encodeABI().substr(74), '0x')
}
