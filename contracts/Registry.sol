pragma solidity ^0.4.24;


contract Registry {
  event Subscribed(bytes32 eventId, address emitter, bytes32 eventName_, address account, bytes4 method);

  struct Subscriber {
    bytes4 method;
    uint timestamp;
  }

  // Multiple contracts can subscribe to the same event
  // Key is keccak256(emitterAddr, eventName)
  mapping(bytes32 => mapping(address => Subscriber)) subscribers;
  mapping(bytes32 => address[]) subscriberList;

  modifier isSubscribed(bytes32 eventId_, address account_) {
    require(subscribers[eventId_][account_].timestamp != 0);
    _;
  }

  /**
   * @dev Subscribes to an event
   * @param emitter_ Address of contract emitting event.
   * @param eventName_ Name of the event being emitted.
   * @param account_ Address of subscribing contract, which should be invoked.
   * @param method_ bytes4(keccak256(signature)) where signature ~= method(param1,param2).
   */
  function subscribe(address emitter_, bytes32 eventName_, address account_, bytes4 method_) public {
    bytes32 eventId = keccak256(abi.encodePacked(emitter_, eventName_));

    Subscriber storage s = subscribers[eventId][account_];
    s.method = method_;
    s.timestamp = now;

    subscriberList[eventId].push(account_);

    emit Subscribed(eventId, emitter_, eventName_, account_, method_);
  }

  /**
   * @dev Unsubscribers from an event.
   * @param eventId_ Name of the event.
   * @param account_ Address of contract wanting to unsubscribe.
   */
  function unsubscribe(bytes32 eventId_, address account_) public isSubscribed(eventId_, account_) {
    delete subscribers[eventId_][account_];
    uint i = accountIndex(eventId_, account_);
    delete subscriberList[eventId_][i];
  }

  /**
   * @dev Invokes a contract which has subscribed to an event.
   * @param eventId_ Name of the event.
   * @param account_ Address of subscriber.
   * @param args_ ABI encoded arguments for the method
   */
  function invoke(bytes32 eventId_, address account_, bytes args_) public isSubscribed(eventId_, account_) {
    Subscriber storage s = subscribers[eventId_][account_];
    require(account_.call(s.method, args_));
  }

  function accountIndex(bytes32 eventId_, address account_) internal view returns(uint) {
    uint i = 0;
    while (subscriberList[eventId_][i] != account_) {
      i++;
    }
    return i;
  }
}
