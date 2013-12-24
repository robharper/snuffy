module.exports = {
  name: 'hammer.js',
  onContext: function() {
    return !!window.Hammer;
  }
};