module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.Scriptaculous && window.Scriptaculous.Version;
  }
};