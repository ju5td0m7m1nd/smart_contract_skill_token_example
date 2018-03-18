var FrankCoin = artifacts.require("FrankCoin");

contract('FrankCoin', function(accounts) {
  it("should assert true", function() {
    var frank_coin = FrankCoin.deployed();
    return frank_coin.then(function(instance){
       token = instance;
       return token.totalSupply.call();
      }).then(function(result){
       assert.equal(result.toNumber(), 100000, 'total supply is wrong');
    })
  });
  it("should return the balance of token owner", async function() {
    var token;
    const instance = await FrankCoin.deployed()
    const result = await instance.balanceOf.call(accounts[0])
    assert.equal(result.toNumber(), 100000, 'balance is wrong');
  });
  it("should transfer right amount of token", async function() {
    const instance = await FrankCoin.deployed()
    instance.transfer(accounts[1], 1000)
    const acc0Result = await instance.balanceOf.call(accounts[0])
    assert.equal(acc0Result.toNumber(), 99000, 'balance is wrong');
    const acc1Result = await instance.balanceOf.call(accounts[1])
    assert.equal(acc1Result.toNumber(), 1000, 'balance is wrong');

  })
});
