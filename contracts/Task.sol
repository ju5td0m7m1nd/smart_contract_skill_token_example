pragma solidity ^0.4.2;

import './zeppelin/lifecycle/Killable.sol';
import './Authentication.sol';

contract Task is Killable {
  
  struct TaskDetail {
    bytes32 taskName;
    uint skillPoints;
    address doneBy;
    bool done;
  }

  address private _authAddress;

  TaskDetail[] public tasks;
  Authentication authContract;
  modifier ifAddressBinded() {
    require(!(_authAddress == 0x0));
    _;
  }
  modifier taskIsAvailable(uint key) {
    if (!(tasks[key].done == false)) {
       revert();
    }
    _;
  }
  modifier checkUserSkillIsEnough(uint requiredSkill) {
    uint skPoints = authContract.getUserSkill(msg.sender);
    require(skPoints > requiredSkill);
    _;
  }

  function bindAuthAddress (address addr) public returns (address authAddr) {
    _authAddress = addr;
    authContract = Authentication(_authAddress);
    return addr;
  }

  function createTask (bytes32 taskName,uint skillPoints) 
  public 
  payable
  ifAddressBinded 
  checkUserSkillIsEnough(skillPoints)
   returns (uint rowNumber) {
    TaskDetail memory newTask;
    newTask.taskName = taskName;
    newTask.skillPoints = skillPoints;
    newTask.done = false;

    // user spend his skill point to create a task
    authContract.deductSkill(skillPoints, msg.sender);

    return tasks.push(newTask) - 1;
  } 

  function finishTask(uint key)
  public
  ifAddressBinded
  taskIsAvailable(key)
    returns(uint skillPoints) {

      authContract.earnSkill(tasks[key].skillPoints, msg.sender);
      tasks[key].done = true;
      tasks[key].doneBy = msg.sender;
      return authContract.getUserSkill(msg.sender);
    }


  function getTasksCount() public constant returns (uint length) {
    return tasks.length;
  }
  function getAuthAddr() public constant returns (address addr) {
    return _authAddress;
  }

  function getTask(uint key) public constant 
    returns ( bytes32 taskName,
    uint skillPoints,
    bool done,
    uint256 doneBy ) {
    return (tasks[key].taskName, tasks[key].skillPoints, tasks[key].done, uint256(tasks[key].doneBy));
  }

  function getTaskName(uint key) public returns (bytes32 name) {
    return tasks[key].taskName;
  }
}
