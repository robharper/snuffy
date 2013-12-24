module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.MooTools && MooTools.version;
  }
};