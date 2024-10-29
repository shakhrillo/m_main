const runWebDriverTest = require('./selenium-helper/runWebDriverTest');

console.log('Running test...');
runWebDriverTest('http://localhost:4444', 'https://maps.app.goo.gl/ks8i1cKt2sdMWveu7', 'test', 'test', true);