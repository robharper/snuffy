module.exports = {
  name: 'mixpanel',
  onContext: function() {
    return !!window.mixpanel;
  }
};