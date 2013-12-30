module.exports = {
  name: 'woopra',
  onContext: function() {
    return !!window.woopra;
  }
};