var assert = require('assert');
var chai = require('chai');
var sample_echo = require('../features/sample_echo');

beforeEach('Setting up the userList', function(){
  console.log('beforeEach');
  // initiate sample_echo 
});

describe('HelloWorld Module', function() {

  it('should return -1 when "Hello" is missing', function() {
    assert.equal(-1, "Hallo World".indexOf("Hello"));
  });


  it('should return 0 when sentence starts with Hello', function() {
    assert.equal(0, "Hello World, how are you?".indexOf("Hello"));
  });

})



