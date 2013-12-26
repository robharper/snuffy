module.exports = {
  name: 'prototype.js',
  onContext: function() {
    return window.Prototype && window.Prototype.Version;
  }
};