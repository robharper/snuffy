module.exports = {
  name: 'zepto.js',
  onContext: function() {
    return !!window.Zepto;
  }
};