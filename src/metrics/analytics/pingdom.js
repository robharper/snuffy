module.exports = {
  name: 'pingdom',
  onContext: function() {
    return !!window._prum;
  }
};