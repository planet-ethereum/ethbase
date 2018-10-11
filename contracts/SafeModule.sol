pragma solidity ^0.4.24;

import "./Receipt.sol";
import "./Block.sol";
import "./lib/PatriciaTrie.sol";
import "./safe/contracts/Module.sol";
import "./safe/contracts/OwnerManager.sol";
import "./safe/contracts/SignatureValidator.sol";

contract SafeModule is Module, SignatureValidator {
  using Block for Block.BlockHeader;

  uint256 public nonce;
  mapping (bytes32 => uint256) public isExecuted;
  mapping (bytes32 => uint256) public logs;

  /// @dev Setup function
  function setup() public {
    setManager();
  }

  /**
   * @dev Executes tx, if event specified by user has occured.
   * @param _receipt RLP-encoded receipt which contains log.
   * @param _parentNodes RLP-encoded list of proof nodes from root to leaf.
   * @param _key Index of TX in block.
   * @param _logIndex Index of log in receipt.
   * @param _blockHeader RLP-encoded block header.
   * @param _emitter Address of event emitter.
   * @param _eventTopic E.g. keccak256(ExampleEvent(type1,type2)).
   * @param _to Destination address of Safe transaction.
   * @param _value Ether value of Safe transaction.
   * @param _data Data payload of Safe transaction.
   * @param _operation Operation type of Safe transaction.
   * @param _nonce Nonce used for this Safe transaction.
   * @param _signatures Packed signature data ({bytes32 r}{bytes32 s}{uint8 v})
   */
  function execConditional(
    bytes _receipt,
    bytes _parentNodes,
    bytes _key,
    uint _logIndex,
    bytes _blockHeader,
    address _emitter,
    bytes32 _eventTopic,
    address _to,
    uint256 _value,
    bytes _data,
    Enum.Operation _operation,
    uint256 _nonce,
    bytes _signatures
  ) public {
    // Checks tx signature, and that it hasn't been executed before.
    checkTransaction(_to, _value, _data, _operation, _nonce, _signatures);
    nonce++;

    // Verifies log proof, checks that this log hasn't been submitted,
    // and if not, marks the log as submitted.
    processLog(_receipt, _parentNodes, _key, _logIndex, _blockHeader, _emitter, _eventTopic);

    // TODO: Append log data and pass to callback
    // bytes memory data = Receipt.extractLog(_receipt, _logIndex);
    require(manager.execTransactionFromModule(_to, _value, _data, _operation), "Could not execute transaction");
  }

  function processLog(
    bytes _receipt,
    bytes _parentNodes,
    bytes _key,
    uint _logIndex,
    bytes _blockHeader,
    address _emitter,
    bytes32 _eventTopic
  ) internal view {
    Block.BlockHeader memory header = Block.decodeBlockHeader(_blockHeader);
    require(header.validateHeader(), "invalid block header");

    bytes32 logId = keccak256(abi.encodePacked(header.hash, _key, _logIndex));
    require(logs[logId] == 0, "log already submitted");

    // Verify proof
    require(PatriciaTrie.verifyProof(_receipt, _parentNodes, _key, header.receiptHash), "proof verification failed");

    // Mark log as submitted
    logs[logId] = 1;
  }

  function checkTransaction(
    address _to,
    uint256 _value,
    bytes _data,
    Enum.Operation _operation,
    uint256 _nonce,
    bytes _signatures
  ) internal view {
    bytes32 transactionHash = getTransactionHash(_to, _value, _data, _operation, _nonce);
    require(isExecuted[transactionHash] == 0, "Transaction already executed");

    checkHash(transactionHash, _signatures);
  }

  function checkHash(bytes32 transactionHash, bytes signatures) internal view {
    // There cannot be an owner with address 0.
    address lastOwner = address(0);
    address currentOwner;
    uint256 i;
    uint256 threshold = OwnerManager(manager).getThreshold();
    // Validate threshold is reached.
    for (i = 0; i < threshold; i++) {
      currentOwner = recoverKey(transactionHash, signatures, i);
      require(OwnerManager(manager).isOwner(currentOwner), "Signature not provided by owner");
      require(currentOwner > lastOwner, "Signatures are not ordered by owner address");
      lastOwner = currentOwner;
    }
  }

  /// @dev Returns hash to be signed by owners.
  /// @param to Destination address.
  /// @param value Ether value.
  /// @param data Data payload.
  /// @param operation Operation type.
  /// @param _nonce Transaction nonce.
  /// @return Transaction hash.
  function getTransactionHash(
    address to,
    uint256 value,
    bytes data,
    Enum.Operation operation,
    uint256 _nonce
  ) public view returns (bytes32) {
    return keccak256(abi.encodePacked(byte(0x19), byte(0), this, to, value, data, operation, _nonce));
  }
}
