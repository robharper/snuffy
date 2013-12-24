module.exports = {
  name: 'knockout.js',
  onContext: function() {
    return window.ko && window.ko.version;
  }
};