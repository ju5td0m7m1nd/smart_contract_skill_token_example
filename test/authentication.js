var Authentication = artifacts.require("./Authentication.sol");
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
  it("...should earn skill.", function() {
    return Authentication.deployed()
      .then(function(instance) {
        authenticationInstance = instance;

        return authenticationInstance.signup("testuser", { from: accounts[0] });
      })
      .then(function() {
        return authenticationInstance.earnSkill.call(99, accounts[0]);
      })
      .then(function(result) {
        assert.equal(result, 99, "The user was not earned his skill point.");
      });
  });
  it("...should create task", function() {
    var task;
    var auth;
    return Task.deployed().then(function(tInstance) {
      return Authentication.deployed()
        .then(function(instance) {
          authenticationInstance = instance;

          return authenticationInstance.signup("testuser", {
            from: accounts[0]
          });
        })
        .then(function() {
          authenticationInstance.earnSkill(99, accounts[0]);
          tInstance.bindAuthAddress(authenticationInstance.address);
          return tInstance.createTask.call("Simple SK", 30, {
            from: accounts[0]
          });
        })
        .then(result => {
          assert.equal(result, 0, "Cannot read correct skill");
        });
    });
  });
  it("...check if task correctly deduct user's skill", function() {
    var task;
    var auth;
    return Task.deployed().then(function(tInstance) {
      return Authentication.deployed()
        .then(function(instance) {
          authenticationInstance = instance;

          return authenticationInstance.signup("testuser", {
            from: accounts[0]
          });
        })
        .then(function() {
          tInstance.bindAuthAddress(authenticationInstance.address);
          tInstance.createTask("Simple SK", 30, { from: accounts[0] });
          return authenticationInstance.getUserSkill.call(accounts[0]);
        })
        .then(result => {
          assert.equal(result, 69, "Cannot read correct skill");
        });
    });
  });
  it("...check task name", function() {
    return Task.deployed()
      .then(function(tInstance) {
        return tInstance.getTaskName.call(0);
      })
      .then(taskName => {
        assert.equal(web3.toUtf8(taskName), "Simple SK", "Task name not match");
      });
  });
  it("...finish task", function() {
    return Task.deployed()
      .then(function(tInstance) {
        return tInstance.finishTask.call(0, { from: accounts[0] });
      })
      .then(skillPoints => {
        assert.equal(skillPoints, 99, "Task name not match");
      });
  });
  it("...read task value", function() {
    return Task.deployed()
      .then(function(tInstance) {
        tInstance.finishTask(0);
        return tInstance.getTask.call(0);
      })
      .then(task => {
        assert.equal(web3.toUtf8(task[0]), "Simple SK", "Task name not match");
        assert.equal(task[1], 30, "Task name not match");
        assert.equal(task[2], true, "Task name not match");
      });
  });
});
