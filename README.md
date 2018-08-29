# Call Me
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/planet-ethereum/Lobby)

The aim of this project is to provide a mechanism for enabling smart contracts to subscribe to events emitted in other contracts. For a short description of the why and how of this project, you can refer to the [about](https://github.com/planet-ethereum/call-me/wiki/About) wiki page.

*Note:* Call Me is currently very early stage, use at own risk!

## Usage
In the given [example](contracts/example), we have an `Emitter` contract, which emits `Transfer(uint256)` when its method is called. We want our `Subscriber` contract to update its state, whenever `Transfer` is emitted. This can be done, by subscribing to the registry, and specifying events and their callback methods. Afterwards, any user who's running an Ethereum client, upon seeing a `Transfer` event, can call `invoke` on `Registry`, which would in turn invoke `Subscriber`'s specified method. Of course, this manual invocation is not practical. In future, there could be a daemon which listens to events, invoking methods automatically, and smart contracts that subscribe would pay a small fee per event invocation.

## Contribute
Most of the discussions are happening in the [issues](https://github.com/planet-ethereum/call-me/issues) and [pull requests](https://github.com/planet-ethereum/call-me/pulls), Suggestions, contributions and critisisms are more than welcome, join in.

If you want to get involved: first of all, thanks for considering to do so! Here's how you can setup your environment:

### Requirements
Node is the only thing you need. After cloning the repository, install the dependencies, and build the contracts.

```bash
$ npm i
$ npx truffle compile
```

### Tests
To run the contracts test suite:

```bash
$ npx truffle test
```
