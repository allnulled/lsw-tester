let hasFailed = 0;
let hasErrored = 0;

const SpecialError = class extends Error { };

describe("UniversalTester API Test", async function (it) {

  it.onFailure(function (error) {
    return true;
  });

  it.onError(function (error) {
    hasErrored++;
  });

  it.never(async function () {
    this.timeout(1000 * 20);
  });

  it("can be loaded", async function () {
    this.timeout(1000 * 20);
  });

  it.always("can do 1", async function () {
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 1000 * 0.2);
    });
  });

  it.never("can do 1", async function () {

  });

  it.normally("can do 1", async function () {

  });

  it.only("can do 1", async function () {

  });

  it.always("can throw error 1", async function () {
    throw new describe.SilencedError("Weherever 1");
  });

  it.always("can throw error 2", async function () {
    throw new describe.SilencedError("Weherever 2");
  });

  it.always("can throw error 3", async function () {
    throw new describe.SilencedError("Weherever 3");
  });

  it.always("can throw onError on silenced errors but not onFailure", async function () {
    if (hasErrored !== 3) {
      throw new Error("The test should have errores 3 times before this one");
    }
    if (hasFailed !== 0) {
      throw new Error("The test should have failed 0 times before this one");
    }
  });

});