pragma solidity ^0.4.24;


contract Registry {
  event Subscribed(bytes32 event_, address account, bytes4 method);

  struct Subscriber {
    address account;
    bytes4 method;
  }

  mapping(bytes32 => Subscriber) subscribers;

  /**
   * @dev Registers an event subscription.
   * @param event_ Name of the event to subscribe to.
   * @param account_ Address of contract which the event should invoke.
   * @param method_ bytes4(keccak256(signature)) where signature ~= method(param1,param2).
   */
  function register(bytes32 event_, address account_, bytes4 method_) public {
    Subscriber storage s = subscribers[event_];
    s.account = account_;
    s.method = method_;

    emit Subscribed(event_, account_, method_);
  }

  /**
   * @dev Invokes all contracts which have subscribed to an event.
   * @param event_ Name of the event.
   * @param args_ ABI encoded arguments for the method
   */
  function invoke(bytes32 event_, bytes args_) public {
    Subscriber storage s = subscribers[event_];
    require(s.account.call(s.method, args_));
  }
}
