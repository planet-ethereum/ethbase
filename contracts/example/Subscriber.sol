pragma solidity ^0.4.24;

contract Subscriber {
  uint public value = 0;
  bytes32 public text;

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
