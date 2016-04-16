var log = 'schart Error: ';

var schart = function(el, config) {
  if (!config || !config.type) {
    console.error(log + 'config or config.type is undefined');
    return null;
  }
  if (el.offsetWidth < 50 || el.offsetHeight < 50) {
    console.error(log + 'that element is too small!');
    return null;
  }
  if (this[config.type]) this[config.type](el, config);
};

if (typeof window === 'undefined') {
  module.exports = function(methods) {
    if(Array.isArray(methods)) methods.forEach(function(method) {
      schart.prototype[method] = require('schart/' + method);
    });
  };
}