module.exports = {
  name: 'optimizely',
  onContext: function() {
    return !!window.optimizely;
  }
};