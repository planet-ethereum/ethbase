pragma solidity ^0.4.24;

import "./lib/RLP.sol";

library Receipt {
  using RLP for RLP.RLPItem;

  function extractLog(bytes _value, uint _logIndex) public returns (bytes) {
    RLP.RLPItem[] memory receiptFields = RLP.toRLPItem(_value).toList();
    require(receiptFields.length == 4, "receipt rlp has wrong len");

    RLP.RLPItem[] memory logs = receiptFields[3].toList();
    require(_logIndex < logs.length, "log index too big");

    RLP.RLPItem[] memory logFields = logs[_logIndex].toList();
    require(logFields.length == 3, "log rlp has wrong number of fields");

    return logFields[2].toData();
  }
}
