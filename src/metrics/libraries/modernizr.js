module.exports = {
  name: 'Modernizr',
  onContext: function() {
    return window.Modernizr && window.Modernizr._version;
  }
};