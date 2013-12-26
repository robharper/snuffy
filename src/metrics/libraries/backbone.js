module.exports = {
  name: 'backbone.js',
  onContext: function() {
    return window.Backbone && window.Backbone.VERSION;
  }
};