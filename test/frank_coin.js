var FrankCoin = artifacts.require("FrankCoin");

contract("FrankCoin", function(accounts) {
  it("should assert true", function() {
    var frank_coin = FrankCoin.deployed();
    return frank_coin
      .then(function(instance) {
        token = instance;
        return token.totalSupply.call();
      })
      .then(function(result) {
        assert.equal(result.toNumber(), 100000, "total supply is wrong");
      });
  });
  it("should return the balance of token owner", async function() {
    var token;
    const instance = await FrankCoin.deployed();
    const result = await instance.balanceOf.call(accounts[0]);
    assert.equal(result.toNumber(), 100000, "balance is wrong");
  });
  it("should transfer right amount of token", async function() {
    const instance = await FrankCoin.deployed();
    instance.transfer(accounts[1], 1000);
    const acc0Result = await instance.balanceOf.call(accounts[0]);
    assert.equal(acc0Result.toNumber(), 99000, "balance is wrong");
    const acc1Result = await instance.balanceOf.call(accounts[1]);
    assert.equal(acc1Result.toNumber(), 1000, "balance is wrong");
  });
  it("should approve 500 coins from 1 to 2", async function() {
    const instance = await FrankCoin.deployed();
    const result = await instance.approve.call(accounts[2], 500, {
      from: accounts[1]
    });
    assert.equal(result, true, "Approve tx failed from acc1 to acc2");
  });
  it("check allowance between account1 and account2", async function() {
    const instance = await FrankCoin.deployed();
    await instance.approve(accounts[2], 500, {
      from: accounts[1]
    });
    const result = await instance.allowance.call(accounts[1], accounts[2]);
    assert.equal(result.toNumber(), 500, "Allowance wrong");
  });
  it("transfer money between account1 and account2", async function() {
    const instance = await FrankCoin.deployed();
    const acc1Result = await instance.balanceOf.call(accounts[1]);
    const result = await instance.transferFrom.call(
      accounts[1],
      accounts[2],
      500, {from : accounts[2]}
    );
    assert.equal(result, true, "Transfer failed");
  });
});
