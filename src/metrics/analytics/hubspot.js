module.exports = {
  name: 'hubspot',
  onContext: function() {
    return !!window._hsq;
  }
};