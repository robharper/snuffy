module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.Prototype && window.Prototype.Version;
  }
};