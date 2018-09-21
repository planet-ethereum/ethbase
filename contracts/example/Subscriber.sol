pragma solidity ^0.4.24;

import "../Ethbase.sol";


contract Subscriber {
  address owner;
  Ethbase ethbase;

  uint public value = 0;
  bytes32 public text;

  constructor(address _ethbase) public {
    owner = msg.sender;
    ethbase = Ethbase(_ethbase); 
  }

  /**
   * @dev Subscribe to ethbase, and provide callback, for when a log is emitted.
   * @param _emitter Address of event emitter contract.
   * @param _eventTopic E.g. keccak256(ExampleEvent(type1,type2)).
   * @param _method Callback method: bytes4(keccak256(exampleMethod(type1,type2))).
   */
  function subscribe(address _emitter, bytes32 _eventTopic, bytes4 _method) public {
    require(msg.sender == owner);
    ethbase.subscribe(_emitter, _eventTopic, this, _method);
  }

  function unsubscribe(bytes32 _eventId) public {
    require(msg.sender == owner);
    ethbase.unsubscribe(_eventId, this);
  }

  // Example callback function.
  function setValue(uint _value) public {
    value = _value;
  }

  function setValues(uint _value, bytes32 _text) public {
    value = _value;
    text = _text;
  }

  function setRandomValue() public {
    // Totally random!
    value = 21;
  }
}
