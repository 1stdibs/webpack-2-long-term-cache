const moduleC = require('./module-c');

module.exports = function (consumerName) {
  console.log('I\'m Module B. My consumer is ' + consumerName);
  moduleC('Module B');
};
