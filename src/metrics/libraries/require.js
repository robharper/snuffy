module.exports = {
  name: 'require.js',
  onContext: function() {
    return window.requirejs && (window.requirejs.version || 'almond.js');
  }
};
