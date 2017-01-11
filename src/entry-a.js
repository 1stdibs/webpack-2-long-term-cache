const react = require('react');
const moduleB = require('./module-b');

console.log('Greetings from Entry A!');
moduleB('Entry A');
console.log('Entry A says "I need react!"', react.Component.toString());
