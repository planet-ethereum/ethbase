pragma solidity ^0.4.24;

import "./lib/PatriciaTrie.sol";
import "./lib/RLP.sol";

// Only for testing purposes
contract Verifier {

  struct BlockHeader {
    bytes32 receiptHash;
    uint number;
  }

  /**
   * @dev Verify the proof of an event.
   */
  function verify(bytes _value, bytes _parentNodes, bytes _path, bytes _blockHeader) public view returns (bool) {
    BlockHeader memory header = decodeBlockHeader(_blockHeader);

    bytes32 validBlockHash = blockhash(header.number);
    bytes32 givenBlockHash = keccak256(_blockHeader);    

    require(validBlockHash == givenBlockHash, "invalid block hash");

    return verifyProof(_value, _parentNodes, _path, header.receiptHash);
  }

  function verifyProof(bytes _value, bytes _parentNodes, bytes _path, bytes32 rootHash) public view returns (bool) {
    return PatriciaTrie.verifyProof(_value, _parentNodes, _path, rootHash);
  }

  function decodeBlockHeader(bytes _blockHeader) internal pure returns (BlockHeader memory h) {
    RLP.RLPItem memory headerItem = RLP.toRLPItem(_blockHeader);
    RLP.RLPItem[] memory headerList = RLP.toList(headerItem);

    bytes32 receiptHash = RLP.toBytes32(headerList[5]);
    uint number = RLP.toUint(headerList[8]);

    h = BlockHeader(receiptHash, number);
  }
}
