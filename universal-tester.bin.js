#!/usr/bin/env node

const path = require("path");
const args = process.argv;
const node_path = args.shift();
const universal_tester_path = args.shift();
const file = args.shift();

require(__dirname + "/universal-tester.bundled.js");
require(path.resolve(file));