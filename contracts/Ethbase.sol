pragma solidity ^0.4.24;

import "./Verifier.sol";
import "./Receipt.sol";

contract Ethbase is Verifier {
  event Subscribed(bytes32 eventId, address emitter, bytes32 eventTopic, address account, bytes4 method);

  struct Subscriber {
    bytes4 method;
    uint timestamp;
  }

  // Multiple contracts can subscribe to the same event
  // Key is keccak256(emitterAddr, eventName)
  mapping(bytes32 => mapping(address => Subscriber)) subscribers;
  mapping(bytes32 => address[]) subscriberList;

  modifier isSubscribed(bytes32 _eventId, address _account) {
    require(subscribers[_eventId][_account].timestamp != 0, "not subscribed");
    _;
  }

  /**
   * @dev Subscribes to an event.
   * @param _emitter Address of contract emitting event.
   * @param _eventTopic E.g. keccak256(ExampleEvent(type1,type2)).
   * @param _account Address of subscribing contract, which should be invoked.
   * @param _method bytes4(keccak256(signature)) where signature ~= method(param1,param2).
   */
  function subscribe(address _emitter, bytes32 _eventTopic, address _account, bytes4 _method) public {
    bytes32 eventId = keccak256(abi.encodePacked(_emitter, _eventTopic));

    Subscriber storage s = subscribers[eventId][_account];
    s.method = _method;
    s.timestamp = now;

    subscriberList[eventId].push(_account);

    emit Subscribed(eventId, _emitter, _eventTopic, _account, _method);
  }

  /**
   * @dev Unsubscribers from an event.
   * @param _eventId Name of the event.
   * @param _subscriber Address of contract wanting to unsubscribe.
   */
  function unsubscribe(bytes32 _eventId, address _subscriber) public isSubscribed(_eventId, _subscriber) {
    delete subscribers[_eventId][_subscriber];
    uint i = accountIndex(_eventId, _subscriber);
    delete subscriberList[_eventId][i];
  }

  /**
   * @dev Submits proof of log, and invokes subscriber.
   * @param _receipt RLP-encoded receipt which contains log.
   * @param _parentNodes RLP-encoded list of proof nodes from root to leaf.
   * @param _key Index of TX in block.
   * @param _logIndex Index of log in receipt.
   * @param _blockHeader RLP-encoded block header.
   * @param _subscriber Address of subscriber.
   * @param _eventId EventId emitted after subscribing.
   */
  function submitLog(
    bytes _receipt,
    bytes _parentNodes,
    bytes _key,
    uint _logIndex,
    bytes _blockHeader,
    address _subscriber,
    bytes32 _eventId
  ) public isSubscribed(_eventId, _subscriber) {
    // Verify proof
    require(verify(_receipt, _parentNodes, _key, _blockHeader), "proof verification failed");

    bytes memory data = Receipt.extractLog(_receipt, _logIndex);

    Subscriber storage s = subscribers[_eventId][_subscriber];
    require(_subscriber.call(s.method, data), "call to subscriber failed");
  }

  function accountIndex(bytes32 _eventId, address _account) internal view returns(uint) {
    uint i = 0;
    while (subscriberList[_eventId][i] != _account) {
      i++;
    }
    return i;
  }
}
