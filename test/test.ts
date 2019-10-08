const stream = require("stream");
const fs = require("fs");

let Stream = stream.Stream;

let s = new Stream();
console.log(s);

let rs = fs.createReadStream("./test/test.html");
console.log(s)
console.log(s.readable)