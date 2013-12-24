module.exports = {
  name: 'chartbeat',
  onContext: function() {
    return !!window.pSUPERFLY;
  }
};