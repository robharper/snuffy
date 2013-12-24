module.exports = {
  name: 'FastClick',
  onContext: function() {
    return !!window.FastClick;
  }
};