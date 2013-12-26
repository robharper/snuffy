module.exports = {
  name: 'yui',
  onContext: function() {
    return window.YUI && window.YUI.version;
  }
};