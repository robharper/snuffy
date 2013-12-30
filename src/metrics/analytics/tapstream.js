module.exports = {
  name: 'tapstream',
  onContext: function() {
    return !!window._tsq;
  }
};