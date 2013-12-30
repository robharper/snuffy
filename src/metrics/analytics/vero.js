module.exports = {
  name: 'vero',
  onContext: function() {
    return !!window._veroq;
  }
};