pragma solidity ^0.4.2;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
  struct User {
    bytes32 name;
    uint skill;
  }

  mapping (address => User) public users;

  uint private id; // Stores user id temporarily

  modifier onlyExistingUser(address _to) {
    // Check if user exists or terminate

    require(!(users[msg.sender].name == 0x0) || !(users[_to].name == 0x0));
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed

    require(!(name == 0x0));
    _;
  }

  function earnSkill(uint skillPoint, address _to) public onlyExistingUser(_to) returns (uint) {
    users[_to].skill += skillPoint;
    return users[_to].skill;
  }

  function deductSkill(uint skillPoint, address _to) public onlyExistingUser(_to) returns (uint) {
    users[_to].skill -= skillPoint;
    return users[_to].skill;
  }

  function getUserSkill(address _sender) public onlyExistingUser(_sender) returns (uint) {
    return users[_sender].skill;
  }

  function login() constant
  public
  onlyExistingUser(address(0))
  returns (bytes32) {
    return (users[msg.sender].name);
  }

  function signup(bytes32 name)
  public
  payable
  onlyValidName(name)
  returns (bytes32) {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.

    if (users[msg.sender].name == 0x0)
    {
        users[msg.sender].name = name;

        return (users[msg.sender].name);
    }

    return (users[msg.sender].name);
  }

  function update(bytes32 name)
  public
  payable
  onlyValidName(name)
  onlyExistingUser(address(0))
  returns (bytes32) {
    // Update user name.

    if (users[msg.sender].name != 0x0)
    {
        users[msg.sender].name = name;

        return (users[msg.sender].name);
    }
  }
}
