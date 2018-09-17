const HDWalletProvider = require('truffle-hdwallet-provider')

const mnemonic = process.env.MNEMONIC

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/')
      },
      network_id: '3',
      gas: 6700000,
      gasPrice: 2000000000 // 2 Gwei
    }
  }
}
