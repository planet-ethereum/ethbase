pragma solidity ^0.4.24;

import "../Registry.sol";


contract Subscriber {
  address owner;
  Registry registry;

  uint public value = 0;
  bytes32 public text;

  constructor(address registry_) public {
    owner = msg.sender;
    registry = Registry(registry_); 
  }

  function subscribe(address emitter_, bytes32 eventName_, bytes4 method_) public {
    require(msg.sender == owner);
    registry.subscribe(emitter_, eventName_, this, method_);
  }

  function unsubscribe(bytes32 eventId_) public {
    require(msg.sender == owner);
    registry.unsubscribe(eventId_, this);
  }

  function setValue(uint value_) public {
    value = value_;
  }

  function setValues(uint value_, bytes32 text_) public {
    value = value_;
    text = text_;
  }

  function setRandomValue() public {
    // Totally random!
    value = 21;
  }
}
