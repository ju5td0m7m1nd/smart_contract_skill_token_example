var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Killable = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var Authentication = artifacts.require("./Authentication.sol");
var Task = artifacts.require('./Task.sol');
var FrankCoin = artifacts.require('./FrankCoin.sol')

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.link(Ownable, Killable);
  deployer.deploy(Killable);
  deployer.link(Killable, Authentication);
  deployer.deploy(Authentication);
  deployer.link(Killable, Task);
  deployer.deploy(Task);
  deployer.deploy(FrankCoin);
};
