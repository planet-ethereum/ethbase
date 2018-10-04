pragma solidity ^0.4.24;

import "./lib/RLP.sol";

library Block {

  struct BlockHeader {
    bytes32 hash;
    bytes32 receiptHash;
    uint number;
  }

  function decodeBlockHeader(bytes _blockHeader) internal pure returns (BlockHeader memory h) {
    RLP.RLPItem memory headerItem = RLP.toRLPItem(_blockHeader);
    RLP.RLPItem[] memory headerList = RLP.toList(headerItem);

    bytes32 hash = keccak256(_blockHeader);
    bytes32 receiptHash = RLP.toBytes32(headerList[5]);
    uint number = RLP.toUint(headerList[8]);

    h = BlockHeader(hash, receiptHash, number);
  }

  function validateHeader(BlockHeader memory h) internal view returns (bool) {
    bytes32 validBlockHash = blockhash(h.number);
    return validBlockHash == h.hash;
  }
}
