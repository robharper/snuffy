module.exports = {
  name: 'mootools',
  onContext: function() {
    return window.MooTools && MooTools.version;
  }
};