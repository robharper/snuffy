module.exports = {
  name: 'modernizr',
  onContext: function() {
    return window.Modernizr && window.Modernizr._version;
  }
};