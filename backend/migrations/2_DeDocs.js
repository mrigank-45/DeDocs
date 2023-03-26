const DeDocs = artifacts.require("DeDocs");

module.exports = function(deployer) {
    deployer.deploy(DeDocs
        ,{gas: 50000000}
        );
};