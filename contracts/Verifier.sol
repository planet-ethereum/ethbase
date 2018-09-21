pragma solidity ^0.4.24;

import "./lib/PatriciaTrie.sol";

contract Verifier {

  struct Proof {
    bytes header;
    bytes32 receiptHash;
    bytes mptPath;
    uint logIndex;
  }

  /**
   * @dev Verify the proof of an event.
   */
  function verifyProof(bytes _value, bytes _parentNodes, bytes _path, bytes32 _root) public returns (bool) {
    return PatriciaTrie.verifyProof(_value, _parentNodes, _path, _root);
  }
}
