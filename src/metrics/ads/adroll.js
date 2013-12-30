module.exports = {
  name: 'adroll',
  onContext: function() {
    return !!window.__adroll;
  }
};