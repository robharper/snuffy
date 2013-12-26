module.exports = {
  name: 'dojo',
  onContext: function() {
    return window.dojo && window.dojo.version && dojo.version.toString();
  }
};