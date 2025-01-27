# universal-tester

Test like mocha with ensurer on browser or node.js.

## Installation

```sh
npm i -s universal-tester
```

## Importation

In node.js:

```js
require("@allnulled/universal-tester");
```

In html:

```html
<script src="node_modules/@allnulled/universal-tester/universal-tester.js"></script>
```

If you want to use [`@allnulled/ensure`](https://github.com/allnulled/ensure) too, import the `universal-tester.bundled.js` version.

## Usage

Once the API is loaded, in any environment you can find `UniversalTester` globally declared. But you also have the `describe` global overwritten, so you can directly:

```js
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
```

## CLI

You can use:
 - `universal-tester`
 - `universal-test`
 - `u-test`
 - `utest`
 - `ute`

All of them are overwritten. I am afraid I do not remember the name, like, like, *`ute` sabe*.

## Browser

Automatic UI reporting through `data-test` html5 attribute when it matched the `describe(?, ...)` parameter. It pretty-prints the JSON with the state of the tests.

## Error management

To stop the test on the first error, add this line:

```js
it.onError(error => throw error);
```

## Things

This is a (bundled) less than 300 lines solution for **testing** and **assertion** that covers most of the topics.