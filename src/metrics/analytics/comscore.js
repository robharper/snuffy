module.exports = {
  name: 'comscore',
  onContext: function() {
    return !!window.COMSCORE;
  }
};