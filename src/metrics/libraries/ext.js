module.exports = {
  name: 'ext.js',
  onContext: function() {
    return window.Ext && window.Ext.version;
  }
};