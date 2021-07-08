const jasmine = require('jasmine');
const chart = require('../js/app');

describe('Loading File', () => {
    it("should call filePicked using spyOn", function () {
        let fileSpy = spyOn(chart.filePicked, "pick");
        let result = chart.filePicked.pick();
        expect(fileSpy).toHaveBeenCalled();
    });
});

describe("jasmine built in matchers unit tests", function () {

    beforeEach(function () {
        this.boolTest = true;
        this.person = {
            firstName: "Allen",
            lastName: "Conway"
        };
    });

    it("should be equal", function () {
        expect('Hello').toEqual('Hello');
    });

    it("boolTest should be true", function () {
        expect(this.boolTest).toBe(true);
    });

    it("should be null", function () {
        var obj = null;
        expect(obj).toBeNull();
    });

    it("testx should be greater than testz", function () {
        var testx = 5;
        var testz = 1;
        expect(testx).toBeGreaterThan(testz);
    });

    it("should contain element with value 2 in the array", function () {
        var myArray = [1, 2, 3, 4, 5];
        expect(myArray).toContain(2);
    });

    it("should not contain element with value 10 in the array", function () {
        var myArray = [1, 2, 3, 4, 5];
        expect(myArray).not.toContain(10);
    });

    it("should have person matching return data", function () {
        var returnData = {
            firstName: "Allen",
            lastName: "Conway"
        };
        expect(returnData).toEqual(this.person);
    });

    it("should be close to value with specified precision", function () {
        //2nd value is the precision after decimal; the default is '2'
        expect(5.1349).toBeCloseTo(5.135, 3);
    });

});