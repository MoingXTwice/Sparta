const jwt = require('jsonwebtoken');

const token = jwt.sign({test: true}, 'hello');

console.log(token);

const decoded = jwt.verify(token, 'hello');

console.log(decoded);