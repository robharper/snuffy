module.exports = {
  name: 'ember.js',
  onContext: function() {
    return window.Ember && window.Ember.VERSION;
  }
};