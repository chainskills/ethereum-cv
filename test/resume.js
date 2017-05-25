var resume = artifacts.require('./Resume.sol');

contract('Resume', function (accounts) {
    it('should be possible for the owner to add an experience', function () {
        var contractInstance;
        var startDate = new Date(2016, 10, 1);
        var endDate = new Date(2016, 11, 31);
        return resume.deployed().then(function (instance) {
            contractInstance = instance;
            return contractInstance.addExperience(startDate.getTime(), endDate.getTime(), true, "Lead Developer", "Adessa", "Mont-Saint-Guibert", "Belgium", "Unbox", {from: accounts[0]});
        }).then(function (results) {
            assert.equal(results.logs.length, 1, "Event was sent");
            assert.equal(results.logs[0].event, "onExperienceAdded", "The right event was sent");
            var eventArgs = results.logs[0].args;
            assert.equal(eventArgs.startDate.toNumber(), startDate.getTime(), "Start date matches");
            assert.equal(eventArgs.endDate.toNumber(), endDate.getTime(), "End date matches");
            //console.log(eventArgs);
            return contractInstance.experienceCounter();
        }).then(function (counter) {
            assert.equal(counter, 1, "Experience has been added");
        });
    });

    it('should be possible for the owner to close an open experience', function () {
        var contractInstance;
        var endDate = new Date(2017, 5, 26, 10, 0);
        return resume.deployed().then(function (instance) {
            contractInstance = instance;
            return contractInstance.closeOpenExperience(1, endDate.getTime(), {from: accounts[0]});
        }).then(function (results) {
            assert.equal(results.logs.length, 1, "Event was sent");
            assert.equal(results.logs[0].event, "onExperienceClosed", "The right event was sent");
            var eventArgs = results.logs[0].args;
            assert.equal(eventArgs.experienceId.toNumber(), 1, "Experience ID matches");
            assert.equal(eventArgs.endDate.toNumber(), endDate.getTime(), "End date matches");
            console.log(new Date(eventArgs.endDate.toNumber()));
            return contractInstance.experienceCounter();
        }).then(function (counter) {
            assert.equal(counter, 1, "No experience has been added");
        });
    });
});