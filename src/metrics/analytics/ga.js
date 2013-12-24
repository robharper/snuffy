module.exports = {
  name: 'googleAnalytics',
  onContext: function() {
    return !!(window.ga || window._gaq);
  }
};