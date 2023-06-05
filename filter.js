const Filter = require('bad-words');
const filter = new Filter();

console.log(filter.clean("You are a nice"));