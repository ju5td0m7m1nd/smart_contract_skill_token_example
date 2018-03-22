pragma solidity ^0.4.2;

import './zeppelin/lifecycle/Killable.sol';
import './Authentication.sol';
import './FrankCoin.sol';

contract Task is Killable {
  
  struct TaskDetail {
    bytes32 taskName;
    uint skillPoints;
    address requestBy;
    address acceptBy;
    address from ;
    bool pending;
    bool done;
  }

  address private _coinAddress;

  TaskDetail[] public tasks;
  Authentication authContract;
  FrankCoin coinContract;
  modifier ifAddressBinded() {
    require(!(_coinAddress == 0x0));
    _;
  }
  modifier taskIsAvailable(uint key) {
    if (!(tasks[key].done == false)) {
       revert();
    }
    _;
  }
  modifier checkUserTokenIsEnough(uint requiredSkill) {
    uint currentToken = coinContract.balanceOf(msg.sender);
    //uint skPoints = authContract.getUserSkill(msg.sender);
    require(currentToken > requiredSkill);
    _;
  }

  modifier finishBySamePerson(uint key) {
    require(tasks[key].acceptBy == msg.sender);
    _;
  }

  modifier isTaskOwner(uint key) {
    require(tasks[key].from == msg.sender);
    _;
  }

  function bindCoinAddress (address addr) public returns (address coinAddress) {
    _coinAddress = addr;
    coinContract = FrankCoin(_coinAddress);
    return addr;
  }

  function createTask (bytes32 taskName,uint skillPoints) 
  public 
  payable
  ifAddressBinded 
  checkUserTokenIsEnough(skillPoints)
   returns (uint rowNumber) {
    TaskDetail memory newTask;
    newTask.taskName = taskName;
    newTask.skillPoints = skillPoints;
    newTask.done = false;
    newTask.pending = false;
    newTask.from = msg.sender;

    return tasks.push(newTask) - 1;
  }

  function requestTask(address addr, uint key) public returns (address acceptBy) {
    tasks[key].requestBy = addr;
    tasks[key].pending = true;
    return tasks[key].requestBy;
  }

  function acceptTask(uint key) 
  public
  isTaskOwner(key)
   returns (address acceptBy) {
    tasks[key].acceptBy = tasks[key].requestBy;
    return tasks[key].acceptBy;
  }

  function finishTask(uint key)
  public
  ifAddressBinded
  taskIsAvailable(key)
  finishBySamePerson(key)
    returns(address _from, address _to) {
      tasks[key].done = true;
      return (tasks[key].from, tasks[key].acceptBy);
    }


  function getTasksCount() public constant returns (uint length) {
    return tasks.length;
  }
  function getAuthAddr() public constant returns (address addr) {
    return _coinAddress;
  }

  function getTask(uint key) public constant 
    returns ( bytes32 taskName,
    uint skillPoints,
    bool done,
    uint256 requestBy,
    bool pending ) {
    return (tasks[key].taskName, tasks[key].skillPoints, tasks[key].done, uint256(tasks[key].requestBy), tasks[key].pending);
  }

  function getTaskName(uint key) public returns (bytes32 name) {
    return tasks[key].taskName;
  }
}
