describe("UniversalTester API Test", async function (it) {

  it.onError(function(error) {
    // THIS HALTS THE EXECUTION ON THE FIRST ERROR
    throw error;
  });
  
  it.never(async function() {
      this.timeout(1000 * 20);
  });

  it("can be loaded", async function() {
      this.timeout(1000 * 20);
  });

  it.always("can do 1", async function() {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000 * 0.2);
      });
  });

  it.never("can do 1", async function() {
      
  });

  it.normally("can do 1", async function() {
      
  });

  it.only("can do 1", async function() {
      
  });

  it.always("can throw error 1", async function() {
      throw new Error("Weherever");
  });

  it.always("can throw error 2", async function() {
      throw new Error("Weherever");
  });

  it.always("can throw error 3", async function() {
      throw new Error("Weherever");
  });

});