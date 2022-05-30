var SimpleBanking = artifacts.require("./SimpleBanking.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleBanking);
};
