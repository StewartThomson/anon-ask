"use strict";
const assert = require("assert");
var sinon = require("sinon");

const token = require("../token");
const fsp = require("fs").promises;

describe("unit tests token", () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  it("should return oauth from token file", async () => {
    sandbox.stub(fsp, "access").returns(true);
    sandbox.stub(fsp, "readFile").returns('[{"test":"test"},{"test2":"test"}]');

    const returnVal = await token.getToken();
    const expected = {
      tokenCache: {
        test: "test"
      },
      userCache: {
        test2: "test"
      }
    };
    assert.equal(returnVal.tokenCache.test, "test");
    assert.equal(returnVal.userCache.test2, "test");
  });
  it("should return null if file doesn't exist", async () => {
    sandbox.stub(fsp, "access").throws();
    const returnVal = await token.getToken();
    assert.equal(returnVal.tokenCache, null);
    assert.equal(returnVal.userCache, null);
  });
  it("should throw error if issues reading the file", async () => {
    sandbox.stub(fsp, "access").returns(true);
    sandbox.stub(fsp, "readFile").throws();
    assert.rejects(token.getToken());
  });
});
