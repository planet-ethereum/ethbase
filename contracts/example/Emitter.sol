pragma solidity ^0.4.24;

contract Emitter {
  event Transfer(uint amount);

  function transfer(uint value_) public {
    emit Transfer(value_);
  }
}
