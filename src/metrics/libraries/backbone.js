module.exports = {
  name: 'Backbone.js',
  onContext: function() {
    return window.Backbone && window.Backbone.VERSION;
  }
};