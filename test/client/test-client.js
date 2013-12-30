describe('Test', function(){

	before(function() {
		module("app");
	});

	it('should return -1 when the value is not present', function(){
		assert.equal(-1, [1,2,3].indexOf(5));
	});

});