pragma solidity ^0.4.24;

contract RelayNetwork {
  event Registered(address addr);

  struct Relayer {
    uint256 registered;
    uint256 deposit;
  }

  mapping (address => Relayer) public relayers;
  address[] public relayerArray;

  uint256 constant STAKE_AMOUNT = 1 ether;

  /**
   * @dev Registers a relayer, if enough stake is deposited.
   */
  function register() public payable {
    require(relayers[msg.sender].registered == 0, "Relayer already registered");
    require(msg.value == STAKE_AMOUNT, "Incorrect deposit value");

    Relayer memory r = Relayer(now, msg.value);
    relayers[msg.sender] = r;
    relayerArray.push(msg.sender);

    emit Registered(msg.sender);
  }

  /**
   * @dev Returns true if relayer can submit txes this block.
   * @param _addr Address of relayer
   */
  function canSubmit(address _addr) public view returns (bool) {
    require(relayers[msg.sender].registered != 0, "Relayer not registered");

    uint256 seed = uint256(blockhash(block.number-1));
    uint i = seed % relayerArray.length;

    return _addr == relayerArray[i];
  }

  /**
   * @dev Delists relayer and returns their deposit.
   */
  function withdraw() public {
    require(relayers[msg.sender].registered != 0, "Relayer not registered");

    msg.sender.transfer(relayers[msg.sender].deposit);

    uint i = relayerIndex(msg.sender);
    delete relayers[msg.sender];
    delete relayerArray[i];
  }

  /**
   * @dev Returns number of relayers.
   */
  function relayersCount() public returns (uint) {
    return relayerArray.length;
  }

  function relayerIndex(address _addr) internal view returns (uint) {
    uint i = 0;
    while (relayerArray[i] != _addr) {
      i++;
    }
    return i;
  }
}
