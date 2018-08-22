# Call Me
The aim of this project is to provide a mechanism for enabling smart contracts to subscribe to events emitted in other contracts. For a short description of the why and how of this project, you can refer to the [about](https://github.com/planet-ethereum/call-me/wiki/About) wiki page.

*Note:* Call Me is currently very early stage, use at own risk!

## Suggested workflow overview
* A registry contract is being deployed, its address is being published in a publicly accessible location.

* A miner declares that he is supporting events communication over that registry.

#### The registry holds two main structs:

1. Mapping `(emittingEventContractAddress, eventType)` =`(subscriberEventContractAddress, functionToBeInvoked, invokationBounty)`
2. Mapping `eventSubscriberContract` => `balanceOfSubscriberContract`

#### The registry contains (at least) the following functions:
1. `addEntry` - Adding an entry to mapping (1)
2. `getBalanceOf` - Retrieving the current balance of subscriber from mapping (2)
3. `addToBalanceOf` - Adding value to the balance of a subscriber
4. `invokeEvent` - Recieving the event that was mined and a proof (TBD) for that event.
5. `rewardMiner` - Transfer bounties from subscirbers to an event miner
6. `removeEntry` - Removes an entry from mapping (1) and return remaining funds in mapping (2)


Now to the flow:

1. Devloper which requires event handling logic, estimates the gas required for executing his callback function.
Then calls the `addEntry` and lists:
   * which event he is interested in
   * which callback function should be invoked upon recieving that event.
   * Funds as he see fit to invoke the callback function.
     * Those should include (the invokation gas + a bounty to incentivize miners to publish events mined) * initial number of times he wishes that eventHandling to take place.

2. Event of type `E` is being emitted from a contract.
3. Miner `M` (the publisher) is mining that event and calls the `invokeEvent`.
4. The registry varifies `E` using the proof provided with it.
5. Upon successful varification, the registery invokes the callback function of all the subscribers that are listed for `E`, using capital from their registry balances (mapping (2)).
6. Regisgtry invokes `rewardMiner` transferring all the bounties from the above subscribers to `M`.

**_Note, it is up for the subscriber contract to validate its funds at the registry and update them accordingly to meet its needs._**

## Usage
In the given [example](contracts/example), we have an `Emitter` contract, which emits `Transfer(uint256)` when its method is called. We want our `Subscriber` contract to update its state, whenever `Transfer` is emitted. This can be done, by subscribing to the registry, and specifying events and their callback methods. Afterwards, any user who's running an Ethereum client, upon seeing a `Transfer` event, can call `invoke` on `Registry`, which would in turn invoke `Subscriber`'s specified method. Of course, this manual invocation is not practical. In future, there could be a daemon which listens to events, invoking methods automatically, and smart contracts that subscribe would pay a small fee per event invocation.

## Contribute
Please feel free to report any problem, or propose a change in the issues.

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
