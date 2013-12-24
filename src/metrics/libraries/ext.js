module.exports = {
  name: 'Ember.js',
  onContext: function() {
    return window.Ext && window.Ext.version;
  }
};