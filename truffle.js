const HDWalletProvider = require('truffle-hdwallet-provider')

const mnemonic = process.env.MNEMONIC

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id,
    },
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 6000000
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/')
      },
      network_id: '3',
      gas: 6700000,
      gasPrice: 2000000000 // 2 Gwei
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/')
      },
      network_id: '4',
      gas: 6700000,
      gasPrice: 2000000000 // 2 Gwei
    }
  },
  compilers: {
    solc: {
      version: '0.4.24'
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
