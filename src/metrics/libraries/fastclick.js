module.exports = {
  name: 'fastclick',
  onContext: function() {
    return !!window.FastClick;
  }
};