module.exports = {
  name: 'scriptaculous',
  onContext: function() {
    return window.Scriptaculous && window.Scriptaculous.Version;
  }
};