describe('Test', function(){

	var module;
	before(function() {
		app = angular.module("app");
	});

	it("should be registered", function() {
		expect(app).not.to.equal(null);
	});

});