const BinarySpace = require("./binarySpaceBotStrategy");
const Simple = require("./simpleBotStrategy");

module.exports = [
    ["BINARY_SPACE", new BinarySpace()],
    ["SIMPLE", new Simple()]
];
