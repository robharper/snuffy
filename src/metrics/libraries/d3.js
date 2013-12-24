module.exports = {
  name: 'd3.js',
  onContext: function() {
    return window.d3 && window.d3.version;
  }
};