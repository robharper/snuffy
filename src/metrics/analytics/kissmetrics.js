module.exports = {
  name: 'kissmetrics',
  onContext: function() {
    return !!window.KM;
  }
};