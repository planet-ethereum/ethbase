pragma solidity ^0.4.24;

contract Sample {
  uint public value = 0;

  function setValue(uint value_) public {
    value = value_;
  }
}
