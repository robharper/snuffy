module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.Ember && window.Ember.VERSION;
  }
};