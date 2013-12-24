module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.dojo && window.dojo.version && dojo.version.toString();
  }
};