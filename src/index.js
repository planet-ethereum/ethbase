const Web3 = require('web3')
const Contract = require('truffle-contract')

const RegistryContract = require('../build/contracts/Registry.json')
const EmitterContract = require('../build/contracts/Emitter.json')
const SubscriberContract = require('../build/contracts/Subscriber.json')

const Miner = require('./miner')

const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
const web3 = new Web3(provider)

web3.eth.getAccounts().then(async (accounts) => {
  const Registry = new Contract(RegistryContract)
  Registry.setNetwork('dev')
  Registry.setProvider(provider)
  const registry = await Registry.at(RegistryContract.networks.dev.address)

  const Emitter = new Contract(EmitterContract)
  Emitter.setNetwork('dev')
  Emitter.setProvider(provider)
  const emitter = await Emitter.at(EmitterContract.networks.dev.address)

  const Subscriber = new Contract(SubscriberContract)
  Subscriber.setNetwork('dev')
  Subscriber.setProvider(provider)
  const subscriber = await Subscriber.at(SubscriberContract.networks.dev.address)

  console.log(Registry.address, Emitter.address, Subscriber.address)

  let method = web3.utils.sha3('setValue(uint256)')
  let hex = web3.utils.toHex('Transfer')
  console.log(method, hex)

  let tx = await subscriber.subscribe(Emitter.address, hex, method, { from: accounts[0] })
  console.log(tx)

  const miner = new Miner(web3, registry, accounts[0])
  miner.run()

/*  tx = await subscriber.unsubscribe(eventId, { from: accounts[0] })*/
  /*console.log(tx)*/
})
