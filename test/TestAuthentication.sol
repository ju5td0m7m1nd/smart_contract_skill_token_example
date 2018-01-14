pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Authentication.sol";
import "../contracts/Task.sol";

contract TestAuthentication {
  Authentication authentication = Authentication(DeployedAddresses.Authentication());
  Task task = Task(DeployedAddresses.Task());

  // function testUserCanSignUpAndLogin() {
   

  //   authentication.signup('testuser');

  //   bytes32 expected = 'testuser';

  //   Assert.equal(authentication.login(), expected, "It should sign up and log in a user.");

  // }
  // function testUserEarnSkill() {

  //   uint expectedSkill = 32;
  //   Assert.equal(authentication.earnSkill(32), expectedSkill, "He should earned his skill");
  // }
  //  function testGetUserSkillInTask() {
  //   task.bindAuthAddress(DeployedAddresses.Authentication());
  //   uint expectedSkill = 32;
  //   Assert.equal(task.checkUserSkillIsEnough(), expectedSkill, "Task should read the correct skill");
  // }
}
