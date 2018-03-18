var Authentication = artifacts.require("./Authentication.sol");
var FrankCoin = artifacts.require("./FrankCoin.sol");
var Task = artifacts.require("./Task.sol");

contract("Authentication", function(accounts) {
  it("...should sign up and log in a user.", function() {
    return Authentication.deployed()
      .then(function(instance) {
        authenticationInstance = instance;

        return authenticationInstance.signup("testuser", { from: accounts[0] });
      })
      .then(function() {
        return authenticationInstance.login.call();
      })
      .then(function(userName) {
        assert.equal(
          web3.toUtf8(userName),
          "testuser",
          "The user was not signed up."
        );
      });
  });
  it("...should create task", async function() {
    const task = await Task.deployed();
    const frankCoin = await FrankCoin.deployed();
    const auth = await Authentication.deployed();

    await auth.signup("testuser", { from: accounts[0] });
    task.bindCoinAddress(frankCoin.address);
    await task.createTask("Landing Page", 30, {
      from: accounts[0]
    });
    const taskCount = await task.getTasksCount.call();
    return assert.equal(taskCount.toNumber(), 1, "Cannot read correct skill");
  });

  it("...check task name", async function() {
    const task = await Task.deployed();
    const taskName = await task.getTaskName.call(0);
    return assert.equal(
      web3.toUtf8(taskName),
      "Landing Page",
      "Task name doesn't match"
    );
  });
  it("...test approve task", async function() {
    const task = await Task.deployed();
    const result = await task.acceptTask.call(accounts[1], 0, {
      from: accounts[0]
    });
    assert.equal(result, accounts[1], "Task not accepted");
  });
  it("...finish task", async function() {
    const task = await Task.deployed();
    await task.acceptTask(accounts[1], 0, {
      from: accounts[0]
    });
    const result = await task.finishTask.call(0, { from: accounts[1] });
    assert.equal(result[0], accounts[0], "Task creator not correct");
    assert.equal(result[1], accounts[1], "Task doer not correct");
  });
  it("...read task value", async function() {
    const task = await Task.deployed();
    await task.finishTask(0, { from: accounts[1] });
    const result = await task.getTask.call(0);
    assert.equal(web3.toUtf8(result[0]), "Landing Page", "Task name not matched");
    assert.equal(result[1], 30, "Task token not matched");
    assert.equal(result[2], true, "Task status not matched");
  });
});
