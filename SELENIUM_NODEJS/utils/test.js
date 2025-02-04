const runWebDriverTest = require('./selenium-helper/runWebDriverTest');

console.log('Running test...');
runWebDriverTest('http://localhost:4444', 'https://maps.app.goo.gl/6dtoqJjGJjVaE9h76', 'test', 'test', true);