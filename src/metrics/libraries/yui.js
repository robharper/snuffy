module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.YUI && window.YUI.version;
  }
};